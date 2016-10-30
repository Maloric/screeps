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
            min: 2
        }, {
            name: 'builder',
            capabilities: [WORK, CARRY, MOVE],
            min: 1
        }, {
            name: 'upgrader',
            capabilities: [WORK, CARRY, MOVE],
            min: 1
        }];

        for (let i = 0; i < blueprints.length; i++) {
            let blueprint = blueprints[i];
            let existing = _.filter(Game.creeps, (creep) => creep.memory.role == blueprint.name);

            if (existing.length < blueprint.min) {
                var newName = Game.spawns['Spawn1'].createCreep(blueprint.capabilities, undefined, {
                    role: blueprint.name
                });
                console.log(`Spawning ${newName}`);
            }
        }
    }

};