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
            capabilities: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            min: 5
        }, {
            name: 'builder',
            capabilities: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            min: 5
        }, {
            name: 'upgrader',
            capabilities: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            min: 6
        }, {
            name: 'archer',
            capabilities: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
            min: 2
        }];

        for (let i = 0; i < blueprints.length; i++) {
            let blueprint = blueprints[i];
            let existing = _.filter(Game.creeps, (creep) => creep.memory.role == blueprint.name);

            if (existing.length < blueprint.min) {
                let spawn = Game.spawns['Spawn1'];

                if (spawn.canCreateCreep(blueprint.capabilities) === OK) {
                    var newName = spawn.createCreep(blueprint.capabilities, undefined, {
                        role: blueprint.name
                    });
                    console.log(`Spawning ${newName}`);
                }
            }
        }
    }
};
