import { Cache } from '../cacheHelper';
import { GetPositionByDirection } from '../util';
export function Distribute(creep: Creep, includeTower: boolean = true) {

    let daisyChain = (creep: Creep) => {
        if (creep.memory._move) {
            let direction = parseInt(creep.memory._move.path.substr(0, 1));
            let dest = GetPositionByDirection(creep.pos, direction);
            let adjacentCreeps = dest.lookFor(LOOK_CREEPS);
            if (adjacentCreeps && adjacentCreeps.length > 0) {
                let adjacentCreep = <Creep>adjacentCreeps[0];
                if (adjacentCreep.memory['role'] === 'distributor') {
                    console.log(`Daisychaining from ${creep.name} to ${adjacentCreep.name}`);
                    creep.transfer(adjacentCreep, RESOURCE_ENERGY);
                    delete creep.memory._move;
                    delete adjacentCreep.memory._move;
                    delete creep['memory']['target'];
                    delete adjacentCreep['memory']['target'];
                }
            }
        }
    };

    if (!creep.memory.target && creep.carry.energy === creep.carryCapacity) {
        let cacheKey = `${creep.room.name}_distributeTargets`;
        let targets = Cache.get(cacheKey, () => <Structure[]>creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                switch (structure.structureType) {
                    case STRUCTURE_TOWER:
                    case STRUCTURE_EXTENSION:
                    case STRUCTURE_SPAWN:
                    case STRUCTURE_STORAGE:
                        return structure.energy < structure.energyCapacity;
                    case STRUCTURE_CONTAINER:
                    case STRUCTURE_STORAGE:
                        let s = <StructureStorage>structure;
                        return s.store.energy < s.storeCapacity;
                    default:
                        return false;
                }
            }
        }));
        if (targets && targets.length > 0) {
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
                let secondaryTargets = _.filter(targets, (s: any) => {
                    return s.structureType === STRUCTURE_STORAGE
                        || s.structureType === STRUCTURE_TOWER;
                });
                let primaryTargets = _.difference(targets, secondaryTargets);
                let closest = creep.pos.findClosestByPath(primaryTargets);
                if (!closest) {
                    closest = creep.pos.findClosestByPath(secondaryTargets);
                }
                if (closest) {
                    creep.memory.target = closest.id;
                } else {
                    console.log(`${creep.name} has no path to target`);
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
                let res = creep.moveTo(t);
                if (res === ERR_NO_PATH) {
                    daisyChain(creep);
                }
                break;
            case ERR_FULL:
            case ERR_INVALID_TARGET:
                delete creep.memory.target;
                break;
        }
    }
}
