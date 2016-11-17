import { Distribute } from '../behaviours/index';
export class Serf {
    static run(creep: Creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            if (!creep.memory.target) {
                let target = <Source>creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                creep.memory.target = target.id;
            }

            if (creep.memory.target) {
                let target = <Source>Game.getObjectById(creep.memory.target);
                let res = creep.harvest(target);
                switch (res) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(target);
                        break;
                    case ERR_INVALID_TARGET:
                        delete creep.memory.target;
                        break;
                }
            }
        } else {
            Distribute(creep);
        }
    }
}

