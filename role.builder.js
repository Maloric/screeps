var roleBuilder = {

    /** @param {Creep} creep **/
    run: (creep) => {
        if(creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    else if(!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building && (!creep.memory.target || creep.memory.target.id)) {
            var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length) {
                creep.memory.target = buildTargets[0].id;
            } else {
                let repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                if(repairTargets.length > 0) {
                    repairTargets.sort((a,b) => a.hits - b.hits);
                    creep.memory.target = repairTargets[0];
                }
            }
	    } else if (creep.memory.building) {
            let target = Game.getObjectById(creep.memory.target);
            let res = creep.build(target);
            roleBuilder.resolveBuild(creep, res, target);
        }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
	},

    resolveBuild: (creep, res, target) => {
        switch(res) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                if (target.hits < target.hitsMax) {
                    res = creep.repair(target);
                    roleBuilder.resolveRepair(creep, res, target);
                } else {
                    creep.say('Build finished.');
                    delete creep.memory.target;
                }
                break;
        }
    },

    resolveRepair: (creep, res, target) => {
        switch(res) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                console.log('Invalid repair target.  Clearing target.');
                delete creep.memory.target;
                break;
        }
    }
};

module.exports = roleBuilder;