import { MoveTo } from '../util';
import { CheckoutEnergy } from '../behaviours/index';
import { Cache } from '../cacheHelper';

export class Builder {
    static run(creep: Creep) {
        if (creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('Collecting');
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('Building');
        }

        if (creep.memory.building && !creep.memory.target) {
            let cacheKey = `${creep.room.name}_buildTargets`;
            let buildTargets = <ConstructionSite[]>Cache.get(cacheKey, () => {
                return creep.room.find(FIND_CONSTRUCTION_SITES);
            });

            if (buildTargets && buildTargets.length > 0) {
                let secondaryTargets = _.filter(buildTargets, (tgt: ConstructionSite) => {
                    return tgt.structureType !== STRUCTURE_EXTENSION;
                });

                let primaryTargets = _.difference(buildTargets, secondaryTargets);

                let target: ConstructionSite;
                if (primaryTargets.length > 0) {
                    target = creep.pos.findClosestByRange(primaryTargets);
                } else {
                    target = creep.pos.findClosestByRange(secondaryTargets);
                }
                if (!!target) {
                    creep.memory.target = target.id;
                }
            } else {
                let cacheKey = `${creep.room.name}_repairTargets`;
                let repairTargets = <Structure[]>Cache.get(cacheKey, () => creep.room.find(FIND_STRUCTURES, {
                    filter: (object: any) => object.hits < object.hitsMax
                }));

                if (repairTargets && repairTargets.length > 0) {
                    // repairTargets.sort((a: any, b: any) => a.hits - b.hits);
                    let closestByPath = creep.pos.findClosestByRange(repairTargets);
                    if (!!closestByPath) {
                        creep.memory.target = creep.pos.findClosestByRange(repairTargets).id;
                    }
                } else {
                    // console.log('No repair targets');
                }
            }
        } else if (creep.memory.building) {
            let target = <any>Game.getObjectById(creep.memory.target);

            let res = creep.build(target);
            Builder.resolveBuild(creep, res, target);
        } else {
            CheckoutEnergy(creep);
        }
    }

    static resolveBuild(creep: Creep, res: number, target: any) {
        switch (res) {
            case ERR_NOT_IN_RANGE:
                MoveTo(creep, target);
                break;
            case ERR_INVALID_TARGET:
                if (target && target.hits && target.hits < target.hitsMax) {
                    // console.log(`Target has ${target.hits} / ${target.hitsMax} hp`);
                    res = creep.repair(target);
                    Builder.resolveRepair(creep, res, target);
                } else {
                    // creep.say('Build finished.');
                    delete creep.memory.target;
                }
                break;
        }
    }

    static resolveRepair(creep: Creep, res: number, target: any) {
        switch (res) {
            case ERR_NOT_IN_RANGE:
                MoveTo(creep, target);
                break;
            case ERR_INVALID_TARGET:
                console.log('Invalid repair target.  Clearing target.');
                delete creep.memory.target;
                break;
        }
    }
}
