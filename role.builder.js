var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    else if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
            var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length) {
                if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0]);
                }
            } else {
                let repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                repairTargets.sort((a,b) => a.hits - b.hits);
                if(repairTargets.length > 0) {
                    if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairTargets[0]);
                    }
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
	}
};

module.exports = roleBuilder;