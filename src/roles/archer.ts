export class Archer {
    static run(creep: Creep) {
        if (!creep.memory.target) {
            let targets = <Creep[]>creep.room.find(FIND_HOSTILE_CREEPS, {
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

    static attack(creep: Creep) {
        let target = <Creep>Game.getObjectById(creep.memory.target);
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

    static idle(creep: Creep) {
        creep.moveTo(Game.flags['camp']);
    }
}
