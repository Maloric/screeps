import { MoveTo } from '../util';
import { Idle } from '../behaviours';

export class Healer {
    static run(creep: Creep) {
        if (!creep.memory.target) {
            let damagedCreeps = <Creep[]>creep.room.find(FIND_MY_CREEPS, {
                filter: (c: Creep) => c.hits < c.hitsMax
            });

            let damagedArchers = <Creep[]>_.filter(damagedCreeps, (c: Creep) => {
                return c.memory.role === 'archer';
            });

            if (damagedArchers.length > 0) {
                let closest = <Creep>creep.pos.findClosestByRange(damagedArchers);
                creep.memory.target = closest.id;
            } else if (damagedCreeps.length > 0) {
                let closest = <Creep>creep.pos.findClosestByRange(damagedCreeps);
                creep.memory.target = closest.id;
            }
        }

        if (creep.memory.target) {
            let target = <Creep>Game.getObjectById(creep.memory.target);
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                MoveTo(creep, target);
            } else if (target.hits < target.hitsMax) {
                delete creep.memory.target;
            }
        } else {
            Idle(creep);
        }
    }
}
