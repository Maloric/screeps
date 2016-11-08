export function CheckoutEnergy(creep: Creep): void {
    let containersWithEnergy: any[] = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: any) => {
            switch (structure.structureType) {
                case STRUCTURE_TOWER:
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_CONTAINER:
                    return structure.energy > 0;
                case STRUCTURE_STORAGE:
                    let s = <StructureStorage>structure;
                    return s.store.energy > 0;
                default:
                    return false;
            }
        }
    });
    if (containersWithEnergy.length > 0) {
        if (containersWithEnergy.length > 0) {
            let target = creep.pos.findClosestByPath(containersWithEnergy);
            let res: any;
            switch (target.structureType) {
                case STRUCTURE_SPAWN:
                case STRUCTURE_EXTENSION:
                    res = target.transferEnergy(creep, creep.carryCapacity - creep.carry.energy);
                    break;
                case STRUCTURE_CONTAINER:
                case STRUCTURE_STORAGE:
                    res = target.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy);
                    break;
            }

            if (res === ERR_NOT_IN_RANGE) {
                console.log("moving to pick up energy");
                creep.moveTo(target);
            }
        }
    }
}
