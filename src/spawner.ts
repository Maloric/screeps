export class Spawner {
    static blueprints: any = [
        {
            name: 'harvester',
            min: 1,
            max: 2,
            tiers: [
                {
                    cost: 700,
                    capabilities: [
                        WORK, WORK, WORK, WORK, WORK,
                        CARRY,
                        MOVE, MOVE, MOVE
                    ]
                },
                {
                    cost: 600,
                    capabilities: [
                        WORK, WORK, WORK, WORK, WORK,
                        CARRY,
                        MOVE
                    ]
                },
                {
                    cost: 300,
                    capabilities: [
                        WORK, WORK,
                        CARRY,
                        MOVE
                    ]
                }
            ],
            memory: {
                distributors: []
            }
        }, {
            name: 'distributor',
            min: 1,
            max: 6,
            tiers: [
                {
                    cost: 450,
                    capabilities: [
                        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE
                    ]
                },
                {
                    cost: 300,
                    capabilities: [
                        CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE
                    ]
                },
                {
                    cost: 150,
                    capabilities: [
                        CARRY, CARRY,
                        MOVE
                    ]
                }
            ]
        }, {
            name: 'builder',
            min: 0,
            max: 4,
            tiers: [
                {
                    cost: 600,
                    capabilities: [
                        WORK, WORK, WORK,
                        CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE
                    ]
                },
                {
                    cost: 400,
                    capabilities: [
                        WORK, WORK,
                        CARRY, CARRY,
                        MOVE, MOVE
                    ]
                },
                {
                    cost: 200,
                    capabilities: [
                        WORK,
                        CARRY,
                        MOVE
                    ]
                }
            ]
        }, {
            name: 'upgrader',
            min: 1,
            max: 4,
            tiers: [
                {
                    cost: 650,
                    capabilities: [
                        WORK, WORK, WORK, WORK,
                        CARRY, CARRY,
                        MOVE, MOVE, MOVE
                    ]
                },
                {
                    cost: 400,
                    capabilities: [
                        WORK, WORK,
                        CARRY, CARRY,
                        MOVE, MOVE
                    ]
                },
                {
                    cost: 200,
                    capabilities: [
                        WORK,
                        CARRY,
                        MOVE
                    ]
                }
            ]
        }, {
            name: 'archer',
            min: 0,
            max: 0,
            tiers: [
                {
                    cost: 720,
                    capabilities: [
                        TOUGH, TOUGH,
                        MOVE, MOVE,
                        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                    ]
                },
                {
                    cost: 350,
                    capabilities: [
                        MOVE,
                        RANGED_ATTACK, RANGED_ATTACK
                    ]
                }
            ]
        }, {
            name: 'healer',
            min: 0,
            max: 0,
            tiers: [
                {
                    cost: 1120,
                    capabilities: [
                        TOUGH, TOUGH,
                        MOVE, MOVE,
                        HEAL, HEAL, HEAL, HEAL
                    ]
                },
                {
                    cost: 930,
                    capabilities: [
                        TOUGH, TOUGH, TOUGH,
                        MOVE, MOVE, MOVE,
                        HEAL, HEAL, HEAL
                    ]
                },
                {
                    cost: 620,
                    capabilities: [
                        TOUGH, TOUGH,
                        MOVE, MOVE,
                        HEAL, HEAL
                    ]
                },
                {
                    cost: 310,
                    capabilities: [
                        TOUGH,
                        MOVE,
                        HEAL
                    ]
                }
            ]
        }
    ];

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
        let blueprints = this.blueprints;

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
                            console.log(`Need ${blueprint.tiers[i].cost} energy to spawn ${blueprint.name}
                                but ${spawn.name} has ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}.
                                Waiting for more energy.`);
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
