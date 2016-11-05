export class Spawner {
    static autoSpawn(): void {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        let blueprints = [{
            name: 'harvester',
            capabilities: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            min: 3
        }, {
                name: 'builder',
                capabilities: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                min: 2
            }, {
                name: 'upgrader',
                capabilities: [WORK, CARRY, MOVE],
                min: 6
            }, {
                name: 'archer',
                capabilities: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
                min: 0
            },
            {
                name: 'serf',
                capabilities: [WORK, CARRY, MOVE],
                min: 1
            }];

        for (let i = 0; i < blueprints.length; i++) {
            let blueprint = blueprints[i];
            let existing = _.filter(Game.creeps, (creep: any) => creep.memory.role === blueprint.name);

            if (existing.length < blueprint.min) {
                let spawn = Game.spawns['Spawn1'];

                if (spawn.canCreateCreep(blueprint.capabilities) === OK) {
                    let newName = spawn.createCreep(blueprint.capabilities, undefined, {
                        role: blueprint.name
                    });
                    console.log(`Spawning ${newName}`);
                }
            }
        }
    }
}
