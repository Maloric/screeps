export const Blueprints: any = [
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
                cost: 900,
                capabilities: [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ]
            },
            {
                cost: 750,
                capabilities: [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE
                ]
            },
            {
                cost: 600,
                capabilities: [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE
                ]
            },
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
        min: 0,
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
