let roleArcher = {
    /** @param {Creep} creep **/
    run: (creep) => {

        if (!creep.memory.target) {
            let targets = creep.room.find(FIND_HOSTILE_CREEPS, {
                filter: function(object) {
                    return object.getActiveBodyparts(ATTACK) === 0;
                }
            });

            if (targets.length > 0) {
                creep.memory.target = targets[0].id;
            }
        }

        if (creep.memory.target) {
            roleArcher.attack(creep);
        }
    },

    attack: (creep) => {
        let target = Game.getObjectById(creep.memory.target);
        if (target) {
            let res = creep.rangedAttack(target);
            switch(res) {
                case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            }
        }
    }
};

module.exports = roleArcher;
