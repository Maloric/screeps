module.exports = {
    autoSpawn: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        let blueprints = [{
            name: 'harvester',
            capabilities: [WORK, CARRY, MOVE],
            min: 3
        }, {
            name: 'builder',
            capabilities: [WORK, WORK, CARRY, MOVE, MOVE],
            min: 3
        }, {
            name: 'upgrader',
            capabilities: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
            min: 6
        }];

        for (let i = 0; i < blueprints.length; i++) {
            let blueprint = blueprints[i];
            let existing = _.filter(Game.creeps, (creep) => creep.memory.role == blueprint.name);

            if (existing.length < blueprint.min) {
                let spawn = Game.spawns['Spawn1'];

                if (spawn.canCreateCreep(blueprint.capabilities) === OK) {
                    var res = spawn.createCreep(blueprint.capabilities, undefined, {
                        role: blueprint.name
                    });
                    console.log(`Spawning ${newName}`);
                }
            }
        }
    }

};