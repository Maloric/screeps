export function Distribute(creep: Creep) {
    if (!creep.memory.target && creep.carry.energy === creep.carryCapacity) {
        let targets = <Structure[]>creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                switch (structure.structureType) {
                    case STRUCTURE_TOWER:
                    case STRUCTURE_EXTENSION:
                    // case STRUCTURE_SPAWN:
                    case STRUCTURE_CONTAINER:
                        return structure.energy < structure.energyCapacity;
                    case STRUCTURE_STORAGE:
                        let s = <StructureStorage>structure;
                        return s.store.energy < s.storeCapacity;
                    default:
                        return false;
                }
            }
        });
        if (targets.length > 0) {
            let tower = _.find(targets, (s: any) => {
                return s.structureType === STRUCTURE_TOWER
                    && s.energy < s.energyCapacity / 1.2;
            });

            if (tower) {
                creep.memory.target = tower.id;
            } else {
                let closest = creep.pos.findClosestByPath(targets);
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
        }
    }
}
