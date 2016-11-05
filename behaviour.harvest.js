let harvestBehaviour = {
    harvest: (creep) => {
        var sources = creep.room.find(FIND_SOURCES);
        var target = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};

module.exports = harvestBehaviour;