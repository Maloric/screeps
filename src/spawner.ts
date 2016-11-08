export class Spawner {
    static autoSpawn(): void {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            } else if (Game.creeps[name].memory.role === 'harvester') {
                let h = Game.creeps[name];
                let newList = _.difference(h.memory.distributors, Object.keys(Game.creeps));
                let diff = _.difference(newList, h.memory.distributors);
                if (diff.length > 0) {
                    h.memory.distributors = newList;
                    console.log('Clearing ' + diff.length + ' stale distributors from ' + h.name);
                }
            }
        }

        let blueprints = [
            {
                name: 'serf',
                capabilities: [WORK, CARRY, MOVE],
                min: 1
            },
            {
                name: 'harvester',
                capabilities: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                min: 2
            }, {
                name: 'distributor',
                capabilities: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                min: 4
            }, {
                name: 'builder',
                capabilities: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                min: 2
            }, {
                name: 'upgrader',
                capabilities: [WORK, WORK, WORK, CARRY, MOVE],
                min: 6
            }, {
                name: 'archer',
                capabilities: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
                min: 5
            }
        ];

        for (let i = 0; i < blueprints.length; i++) {
            let blueprint = blueprints[i];
            let existing = _.filter(Game.creeps, (creep: Creep) => creep.memory.role === blueprint.name);

            if (existing.length < blueprint.min) {
                let spawn = Game.spawns['Spawn1'];

                if (spawn.canCreateCreep(blueprint.capabilities) === OK) {
                    let newName = spawn.createCreep(blueprint.capabilities, undefined, {
                        role: blueprint.name
                    });
                    console.log(`Spawning ${newName}`);
                }
                break;
            }
        }
    }
}
