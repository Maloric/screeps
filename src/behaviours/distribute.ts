export function Distribute(creep: Creep) {
    let targets = <Structure[]>creep.room.find(FIND_STRUCTURES, {
        filter: (structure: any) => {
            return (structure.structureType === STRUCTURE_TOWER
                || structure.structureType === STRUCTURE_EXTENSION
                || structure.structureType === STRUCTURE_SPAWN
                || structure.structureType === STRUCTURE_CONTAINER
                || structure.structureType === STRUCTURE_STORAGE) &&
                structure.energy < structure.energyCapacity;
        }
    });
    if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    }
}
