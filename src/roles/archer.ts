import { MoveTo } from '../util';
import { Idle } from '../behaviours';

export class Archer {
    static run(creep: Creep) {
        if (!creep.memory.target) {
            let targets = <Creep[]>creep.room.find(FIND_HOSTILE_CREEPS);
            if (targets.length > 0) {
                creep.memory.target = targets[0].id;
            }
        }

        if (creep.memory.target) {
            Archer.attack(creep);
        } else {
            Idle(creep);
        }
    }

    static attack(creep: Creep) {
        let target = <Creep>Game.getObjectById(creep.memory.target);
        console.log(creep.name, target);
        if (target) {
            let res = creep.rangedAttack(target);
            switch (res) {
                case ERR_NOT_IN_RANGE:
                    console.log('Not in range');
                    MoveTo(creep, target);
                    break;
                case ERR_INVALID_TARGET:
                    console.log('Invalid Target');
                    delete creep.memory.target;
                    break;
            }
        }
    }
}
