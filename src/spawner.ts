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
        let blueprints = [
            {
                name: 'harvester',
                min: 1,
                max: 2,
                tiers: [
                    {
                        cost: 600,
                        capabilities: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                    },
                    {
                        cost: 400,
                        capabilities: [WORK, WORK, WORK, CARRY, MOVE],
                    },
                    {
                        cost: 200,
                        capabilities: [WORK, CARRY, MOVE],
                    }
                ],
                memory: {
                    distributors: []
                }
            }, {
                name: 'distributor',
                min: 1,
                max: 4,
                tiers: [
                    {
                        cost: 300,
                        capabilities: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                    },
                    {
                        cost: 150,
                        capabilities: [CARRY, CARRY, MOVE],
                    }
                ]
            }, {
                name: 'builder',
                min: 0,
                max: 4,
                tiers: [
                    {
                        cost: 400,
                        capabilities: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                    },
                    {
                        cost: 200,
                        capabilities: [WORK, CARRY, MOVE],
                    }
                ]
            }, {
                name: 'upgrader',
                min: 1,
                max: 6,
                tiers: [
                    {
                        cost: 400,
                        capabilities: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                    },
                    {
                        cost: 200,
                        capabilities: [WORK, CARRY, MOVE],
                    }
                ]
            }, {
                name: 'archer',
                min: 0,
                max: 2,
                tiers: [
                    {
                        cost: 350,
                        capabilities: [RANGED_ATTACK, RANGED_ATTACK, MOVE],
                    }
                ]
            }
        ];

        if (Object.keys(Game.creeps).length === 0) {
            // Spawn a single serf if there are no other creeps
            blueprints = [
                {
                    name: 'serf',
                    min: 1,
                    max: 1,
                    tiers: [
                        {
                            cost: 200,
                            capabilities: [WORK, CARRY, MOVE],
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

        if (Spawner.fulfillCreepOrders(blueprints, 'min')) {
            if (Spawner.fulfillCreepOrders(blueprints, 'max')) {
                console.log('Maximum creep order fulfilled.');
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
                    if (Spawner.tryCreateCreep(spawn, blueprint, i)) {
                        break;
                    };
                }
                fulfilled = false;
                break;
            }
        }
        return fulfilled;
    }

    static tryCreateCreep(spawn: StructureSpawn, blueprint: any, tierIndex: number): boolean {
        let tier = blueprint.tiers[tierIndex];
        if (spawn.canCreateCreep(tier.capabilities) === OK) {
            let newName = spawn.createCreep(tier.capabilities, undefined, _.merge(blueprint.memory || {}, {
                role: blueprint.name
            }));
            console.log(`Spawning ${newName}`);
            return true;
        }
        return false;
    }
}
