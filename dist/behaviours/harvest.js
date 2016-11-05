export function Harvest(creep) {
    let target = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}
