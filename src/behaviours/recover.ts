export function Recover(creep: Creep) {
    let target = <Resource>creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}
