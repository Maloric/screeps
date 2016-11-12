export function CheckoutEnergy(creep: Creep): void {
    if (!Memory['enoughEnergyInReserve']) {
        creep.say('Energy Freeze');
        return;
    }

    let containersWithEnergy: any[] = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: any) => {
            switch (structure.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_CONTAINER:
                    return structure.energy > 0;
                case STRUCTURE_STORAGE:
                    return structure.store.energy > 0;
                default:
                    return false;
            }
        }
    });
    if (containersWithEnergy.length > 0) {
        if (containersWithEnergy.length > 0) {
            let target = creep.pos.findClosestByPath(containersWithEnergy);
            if (!target) {
                return;
            }
            let res: any;
            switch (target.structureType) {
                case STRUCTURE_SPAWN:
                case STRUCTURE_EXTENSION:
                    res = target.transferEnergy(creep);
                    break;
                case STRUCTURE_CONTAINER:
                case STRUCTURE_STORAGE:
                    res = target.transfer(creep, RESOURCE_ENERGY);
                    break;
            }

            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}
