module.exports = /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(1);
	const spawner_1 = __webpack_require__(8);
	module.exports.loop = () => {
	    spawner_1.Spawner.autoSpawn();
	    let tower = Game.getObjectById('5819fe430de1de3555de348d');
	    if (tower) {
	        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (closestHostile) {
	            tower.attack(closestHostile);
	        }
	        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: (structure) => structure.hits < structure.hitsMax
	        });
	        if (closestDamagedStructure) {
	            tower.repair(closestDamagedStructure);
	        }
	    }
	    for (let name in Game.creeps) {
	        let creep = Game.creeps[name];
	        switch (creep.memory.role) {
	            case 'harvester':
	            case 'serf':
	                index_1.Harvester.run(creep);
	                break;
	            case 'upgrader':
	                index_1.Upgrader.run(creep);
	                break;
	            case 'builder':
	                index_1.Builder.run(creep);
	                break;
	            case 'archer':
	                index_1.Archer.run(creep);
	                break;
	            default:
	                console.warn(`Invalid creep role on ${name}: ${creep.memory.role}`);
	        }
	    }
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var archer_1 = __webpack_require__(2);
	exports.Archer = archer_1.Archer;
	var builder_1 = __webpack_require__(3);
	exports.Builder = builder_1.Builder;
	var harvester_1 = __webpack_require__(6);
	exports.Harvester = harvester_1.Harvester;
	var upgrader_1 = __webpack_require__(7);
	exports.Upgrader = upgrader_1.Upgrader;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	class Archer {
	    static run(creep) {
	        if (!creep.memory.target) {
	            let targets = creep.room.find(FIND_HOSTILE_CREEPS, {
	                filter: (object) => {
	                    return object.getActiveBodyparts(ATTACK) === 0;
	                }
	            });
	            if (targets.length > 0) {
	                creep.memory.target = targets[0].id;
	            }
	        }
	        if (creep.memory.target) {
	            Archer.attack(creep);
	        }
	        else {
	            Archer.idle(creep);
	        }
	    }
	    static attack(creep) {
	        let target = Game.getObjectById(creep.memory.target);
	        if (target) {
	            let res = creep.rangedAttack(target);
	            switch (res) {
	                case ERR_NOT_IN_RANGE:
	                    creep.moveTo(target);
	                    break;
	                case ERR_INVALID_TARGET:
	                    delete creep.memory.target;
	                    break;
	            }
	        }
	    }
	    static idle(creep) {
	        creep.moveTo(Game.flags['camp']);
	    }
	}
	exports.Archer = Archer;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(4);
	class Builder {
	    static run(creep) {
	        if (creep.carry.energy === 0) {
	            creep.memory.building = false;
	            creep.say('harvesting');
	        }
	        else if (creep.carry.energy === creep.carryCapacity) {
	            creep.memory.building = true;
	            creep.say('building');
	        }
	        if (creep.memory.building && !creep.memory.target) {
	            let buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
	            if (buildTargets.length > 0) {
	                creep.memory.target = buildTargets[0].id;
	            }
	            else {
	                console.log(`${creep.name} is repairing`);
	                let repairTargets = creep.room.find(FIND_STRUCTURES, {
	                    filter: (object) => object.hits < object.hitsMax
	                });
	                if (repairTargets.length > 0) {
	                    repairTargets.sort((a, b) => a.hits - b.hits);
	                    creep.memory.target = repairTargets[0].id;
	                }
	                else {
	                    console.log('No repair targets');
	                }
	            }
	        }
	        else if (creep.memory.building) {
	            let target = Game.getObjectById(creep.memory.target);
	            let res = creep.build(target);
	            Builder.resolveBuild(creep, res, target);
	        }
	        else {
	            index_1.Harvest(creep);
	        }
	    }
	    static resolveBuild(creep, res, target) {
	        switch (res) {
	            case ERR_NOT_IN_RANGE:
	                creep.moveTo(target);
	                break;
	            case ERR_INVALID_TARGET:
	                if (target && target.hits && target.hits < target.hitsMax) {
	                    console.log(`Target has ${target.hits} / ${target.hitsMax} hp`);
	                    res = creep.repair(target);
	                    Builder.resolveRepair(creep, res, target);
	                }
	                else {
	                    creep.say('Build finished.');
	                    delete creep.memory.target;
	                }
	                break;
	        }
	    }
	    static resolveRepair(creep, res, target) {
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
	exports.Builder = Builder;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var harvest_1 = __webpack_require__(5);
	exports.Harvest = harvest_1.Harvest;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function Harvest(creep) {
	    let target = creep.pos.findClosestByPath(FIND_SOURCES);
	    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
	        creep.moveTo(target);
	    }
	}
	exports.Harvest = Harvest;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(4);
	class Harvester {
	    static run(creep) {
	        if (creep.carry.energy < creep.carryCapacity) {
	            index_1.Harvest(creep);
	        }
	        else {
	            let targets = creep.room.find(FIND_STRUCTURES, {
	                filter: (structure) => {
	                    return (structure.structureType === STRUCTURE_TOWER
	                        || structure.structureType === STRUCTURE_EXTENSION
	                        || structure.structureType === STRUCTURE_SPAWN
	                        || structure.structureType === STRUCTURE_CONTAINER
	                        || structure.structureType === STRUCTURE_STORAGE) &&
	                        structure.energy < structure.energyCapacity;
	                }
	            });
	            if (targets.length > 0) {
	                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	                    creep.moveTo(targets[0]);
	                }
	            }
	        }
	    }
	}
	exports.Harvester = Harvester;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(4);
	class Upgrader {
	    static run(creep) {
	        if (creep.memory.upgrading && creep.carry.energy === 0) {
	            creep.memory.upgrading = false;
	            creep.say('harvesting');
	        }
	        else if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
	            creep.memory.upgrading = true;
	            creep.say('upgrading');
	        }
	        if (creep.memory.upgrading) {
	            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(creep.room.controller);
	            }
	        }
	        else {
	            index_1.Harvest(creep);
	        }
	    }
	}
	exports.Upgrader = Upgrader;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	class Spawner {
	    static autoSpawn() {
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
	                min: 2
	            },
	            {
	                name: 'serf',
	                capabilities: [WORK, CARRY, MOVE],
	                min: 1
	            }];
	        for (let i = 0; i < blueprints.length; i++) {
	            let blueprint = blueprints[i];
	            let existing = _.filter(Game.creeps, (creep) => creep.memory.role === blueprint.name);
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
	exports.Spawner = Spawner;


/***/ }
/******/ ]);