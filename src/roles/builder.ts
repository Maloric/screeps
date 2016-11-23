import { CheckoutEnergy } from '../behaviours/index';
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
            let buildTargets = <ConstructionSite[]>creep.room.find(FIND_CONSTRUCTION_SITES);
            if (buildTargets.length > 0) {
                let secondaryTargets = _.filter(buildTargets, (tgt: ConstructionSite) => {
                    return tgt.structureType !== STRUCTURE_EXTENSION;
                });

                let primaryTargets = _.difference(buildTargets, secondaryTargets);

                let target: ConstructionSite;
                if (primaryTargets.length > 0) {
                    target = creep.pos.findClosestByPath(primaryTargets);
                } else {
                    target = creep.pos.findClosestByPath(secondaryTargets);
                }

                creep.memory.target = target.id;
            } else {
                // console.log(`${creep.name} is repairing`);
                let repairTargets = <Structure[]>creep.room.find(FIND_STRUCTURES, {
                    filter: (object: any) => object.hits < object.hitsMax
                });

                if (repairTargets.length > 0) {
                    // repairTargets.sort((a: any, b: any) => a.hits - b.hits);
                    let closestByPath = creep.pos.findClosestByPath(repairTargets);
                    if (!!closestByPath) {
                        creep.memory.target = creep.pos.findClosestByPath(repairTargets).id;
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
                creep.moveTo(target);
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
                creep.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                console.log('Invalid repair target.  Clearing target.');
                delete creep.memory.target;
                break;
        }
    }
}
