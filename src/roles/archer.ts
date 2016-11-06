export class Archer {
    static run(creep: any) {
        if (!creep.memory.target) {
            let targets = creep.room.find(FIND_HOSTILE_CREEPS, {
                filter: (object: any) => {
                    return object.getActiveBodyparts(ATTACK) === 0;
                }
            });

            if (targets.length > 0) {
                creep.memory.target = targets[0].id;
            }
        }

        if (creep.memory.target) {
            Archer.attack(creep);
        } else {
            Archer.idle(creep);
        }
    }

    static attack(creep: any) {
        let target = Game.getObjectById(creep.memory.target);
        if (target) {
            let res = creep.rangedAttack(target);
            switch (res) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_INVALID_TARGET:
                    delete creep.memory.target;
                    break;
            }
        }
    }

    static idle(creep: any) {
        creep.moveTo(Game.flags['camp']);
    }
}