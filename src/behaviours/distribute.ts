export function Distribute(creep: Creep) {
    let targets = <Structure[]>creep.room.find(FIND_STRUCTURES, {
        filter: (structure: any) => {
            switch (structure.structureType) {
                case STRUCTURE_TOWER:
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
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
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    }
}
