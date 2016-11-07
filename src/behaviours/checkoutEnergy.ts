export function CheckoutEnergy(creep: Creep): void {
    let containersWithEnergy: any[] = creep.room.find(FIND_STRUCTURES, {
        filter: (x: any) =>
            (x.structureType === STRUCTURE_STORAGE
                && (<StructureStorage>x).store[RESOURCE_ENERGY] > 0)
            || (x.structureType === STRUCTURE_CONTAINER
                && (<StructureContainer>x).store[RESOURCE_ENERGY] > 0)
            || (x.structureType === STRUCTURE_EXTENSION
                && (<StructureExtension>x).energy > 0)
    });
    if (containersWithEnergy.length > 0) {
        let target: any = creep.pos.findClosestByPath(containersWithEnergy)[0];
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}
