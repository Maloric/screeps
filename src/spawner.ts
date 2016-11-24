import { Cache } from './cacheHelper';
import { Blueprints } from './blueprints';
export class Spawner {
    static cleanup(): void {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                let role = Memory.creeps[name].role;
                Memory['roster'][role] = _.reject(Memory['roster'][role], (c) => c === name);
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            } else if (Game.creeps[name].memory.role === 'harvester') {
                let h = Game.creeps[name];
                let staleDistributors = _.difference(h.memory.distributors, Object.keys(Game.creeps));
                if (staleDistributors.length > 0) {
                    let correct = _.difference(h.memory.distributors, staleDistributors);
                    h.memory.distributors = correct;
                    console.log('Clearing ' + staleDistributors.length + ' stale distributors from ' + h.name);
                }
            }
        }
    }

    static autoSpawn(): void {
        let spawn = Game.spawns['Spawn1'];
        let blueprints = Blueprints;

        let cacheKey = `${spawn.room.name}_constructionSites`;
        let constructionSites = Cache.get(cacheKey, () => {
            return spawn.room.find(FIND_CONSTRUCTION_SITES);
        });
        if (!constructionSites && Memory['roster']['builder']) {
            blueprints[2].max = 1; // TODO: this shouldn't have a hard coded index
            let reassigned = _.take(Memory['roster']['builder'], Memory['roster']['builder'].length - 1);
            for (var i = 0; i < reassigned.length; i++) {
                let creepName = <string>reassigned[i];
                Game.creeps[creepName].memory['role'] = 'upgrader';
            }
        }

        if ((!Memory['roster']['harvester']
            || Memory['roster']['harvester'].length === 0)
            && Game.spawns['Spawn1'].canCreateCreep(blueprints[0].tiers[2].capabilities) !== OK
        ) {
            // Spawn up to three serfs if there are no harvesters and not enough to create one
            blueprints = [
                {
                    name: 'serf',
                    min: 1,
                    max: 3,
                    force: true,
                    tiers: [
                        {
                            cost: 200,
                            capabilities: [WORK, CARRY, MOVE]
                        }
                    ]
                }
            ];
        } else if (Memory['roster']['serf']
            && Memory['roster']['serf'].length > 0
            && Memory['roster']['harvester']
            && Memory['roster']['harvester'].length > 0) {
            // Once there is at least one harvester, turn any serfs into distributors
            _.each(Memory['roster']['serf'], (serfName) => {
                Game.creeps[serfName].memory.role = 'distributor';
            });
        }

        if (this.fulfillCreepOrders(blueprints, 'min')) {
            if (this.fulfillCreepOrders(blueprints, 'max')) {
                // console.log('Maximum creep order fulfilled.');
            }
        };
    }

    static fulfillCreepOrders(blueprints: any, type: 'min' | 'max'): boolean {
        let fulfilled = true;
        for (let i = 0; i < blueprints.length; i++) {
            let blueprint = blueprints[i];
            let existing = Memory['roster'][blueprint.name];

            if ((!existing && blueprint[type] > 0) || (existing && existing.length < blueprint[type])) {
                let spawn = Game.spawns['Spawn1'];
                for (let i = 0; i < blueprint.tiers.length; i++) {
                    if (this.tryCreateCreep(spawn, blueprint, i)) {
                        break;
                    } else {
                        if (spawn.room.energyCapacityAvailable >= blueprint.tiers[i].cost
                            && (
                                // Only delay if someone is actually harvesting energy
                                (
                                    Memory['roster']['serf'] &&
                                    Memory['roster']['serf'].length > 0
                                )
                                ||
                                (
                                    Memory['roster']['harvester'] &&
                                    Memory['roster']['harvester'].length > 0 &&
                                    Memory['roster']['distributor'] &&
                                    Memory['roster']['distributor'].length > 0
                                )
                            )
                        ) {
                            console.log(`Need ${blueprint.tiers[i].cost} energy to spawn ${blueprint.name}`
                                + ` but ${spawn.name} has ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}.`
                                + ` Waiting for more energy.`);
                            break;
                        }
                    };
                }
                fulfilled = false;
                break;
            }
        }
        return fulfilled;
    }

    static tryCreateCreep(spawn: StructureSpawn, blueprint: any, tierIndex: number): boolean {
        if (blueprint.force
            || blueprint.name === 'harvester'
            || Memory['enoughEnergyInReserve']
            || (Memory['roster']['harvester']
                && Memory['roster']['harvester'].length > 0
            )) {

            let tier = blueprint.tiers[tierIndex];
            if (spawn.canCreateCreep(tier.capabilities) === OK) {
                let newName = spawn.createCreep(tier.capabilities, undefined, _.merge(blueprint.memory || {}, {
                    role: blueprint.name
                }));
                console.log(`Spawning ${newName}`);
                return true;
            }
        }
        return false;
    }
}
