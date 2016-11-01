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

	    if(creep.memory.building && !creep.memory.buildTarget) {
            var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length) {
                creep.memory.buildTarget = buildTargets[0];
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
            let res = creep.build(creep.memory.target);
            this.resolveBuild(res);
        }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
	},

    resolveBuild: (creep, res) => {
        switch(res) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.memory.target);
                break;
            case ERR_INVALID_TARGET:
                if (creep.memory.target.hits < creep.memory.target.hitsMax) {
                    res = creep.repair(creep.memory.target);
                    this.resolveRepair(res);
                } else {
                    creep.say('Repair finished.');
                    delete creep.memory.target;
                }
                break;
        }
    },

    resolveRepair: (creep, res) => {
        switch(res) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.memory.target);
                break;
            case ERR_INVALID_TARGET:
                console.log('Invalid repair target.  Clearing target.');
                delete creep.memory.target;
                break;
        }
    }
};

module.exports = roleBuilder;