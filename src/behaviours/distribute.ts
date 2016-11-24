import { Cache } from '../cacheHelper';
export function Distribute(creep: Creep, includeTower: boolean = true) {
    if (!creep.memory.target && creep.carry.energy === creep.carryCapacity) {
        let cacheKey = `${creep.room.name}_distributeTargets`;
        let targets = Cache.get(cacheKey, () => <Structure[]>creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                switch (structure.structureType) {
                    case STRUCTURE_TOWER:
                    case STRUCTURE_EXTENSION:
                    case STRUCTURE_SPAWN:
                    case STRUCTURE_CONTAINER:
                    case STRUCTURE_STORAGE:
                        return structure.energy < structure.energyCapacity;
                    case STRUCTURE_STORAGE:
                        let s = <StructureStorage>structure;
                        return s.store.energy < s.storeCapacity;
                    default:
                        return false;
                }
            }
        }));
        if (targets.length > 0) {
            let tower: any;
            if (!!includeTower) {
                // Tower should have minimum 850 energy first
                tower = _.find(targets, (s: any) => {
                    return s.structureType === STRUCTURE_TOWER
                        && s.energy < s.energyCapacity * 0.85;
                });
            }

            if (!!tower) {
                creep.memory.target = (<StructureTower>tower).id;
            } else {
                // Only fill storage above 500 if there are no other valid targets
                let secondaryTargets = _.filter(targets, (s: any) => {
                    return s.structureType === STRUCTURE_STORAGE
                        && s.store.energy < 500;
                });
                let primaryTargets = _.difference(targets, secondaryTargets);
                let closest = creep.pos.findClosestByPath(primaryTargets);
                if (!closest) {
                    closest = creep.pos.findClosestByPath(secondaryTargets);
                }
                if (closest) {
                    creep.memory.target = closest.id;
                }
            }
        }
    }

    if (creep.memory.target) {
        let t = <Structure>Game.getObjectById(creep.memory.target);
        let res = creep.transfer(t, RESOURCE_ENERGY);
        switch (res) {
            case OK:
                delete creep.memory.target;
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(t);
                break;
            case ERR_INVALID_TARGET:
                delete creep.memory.target;
                break;
        }
    }
}
