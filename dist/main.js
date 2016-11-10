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
	const spawner_1 = __webpack_require__(14);
	module.exports.loop = () => {
	    spawner_1.Spawner.cleanup();
	    let tower = Game.getObjectById('5819fe430de1de3555de348d');
	    if (tower) {
	        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (closestHostile) {
	            tower.attack(closestHostile);
	        }
	        if (tower.energy > tower.energyCapacity * 0.85) {
	            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	                filter: (structure) => structure.hits < structure.hitsMax
	            });
	            if (closestDamagedStructure) {
	                tower.repair(closestDamagedStructure);
	            }
	        }
	    }
	    let creepRoster = {};
	    for (let name in Game.creeps) {
	        let creep = Game.creeps[name];
	        let role = creep.memory.role;
	        if (!creepRoster[role]) {
	            creepRoster[role] = [];
	        }
	        creepRoster[role].push(creep.name);
	        switch (role) {
	            case 'harvester':
	                index_1.Harvester.run(creep);
	                break;
	            case 'distributor':
	                index_1.Distributor.run(creep);
	                break;
	            case 'serf':
	                index_1.Serf.run(creep);
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
	            case 'healer':
	                index_1.Healer.run(creep);
	                break;
	            default:
	                console.warn(`Invalid creep role on ${name}: ${creep.memory.role}`);
	        }
	    }
	    Memory['roster'] = creepRoster;
	    spawner_1.Spawner.autoSpawn();
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var archer_1 = __webpack_require__(2);
	exports.Archer = archer_1.Archer;
	var builder_1 = __webpack_require__(3);
	exports.Builder = builder_1.Builder;
	var harvester_1 = __webpack_require__(9);
	exports.Harvester = harvester_1.Harvester;
	var upgrader_1 = __webpack_require__(10);
	exports.Upgrader = upgrader_1.Upgrader;
	var distributor_1 = __webpack_require__(11);
	exports.Distributor = distributor_1.Distributor;
	var serf_1 = __webpack_require__(12);
	exports.Serf = serf_1.Serf;
	var healer_1 = __webpack_require__(13);
	exports.Healer = healer_1.Healer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	class Archer {
	    static run(creep) {
	        if (!creep.memory.target) {
	            let targets = creep.room.find(FIND_HOSTILE_CREEPS);
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
	        console.log(creep.name, target);
	        if (target) {
	            let res = creep.rangedAttack(target);
	            switch (res) {
	                case ERR_NOT_IN_RANGE:
	                    console.log('Not in range');
	                    creep.moveTo(target);
	                    break;
	                case ERR_INVALID_TARGET:
	                    console.log('Invalid Target');
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
	            creep.say('Collecting');
	        }
	        else if (creep.carry.energy === creep.carryCapacity) {
	            creep.memory.building = true;
	            creep.say('Building');
	        }
	        if (creep.memory.building && !creep.memory.target) {
	            let buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
	            if (buildTargets.length > 0) {
	                creep.memory.target = buildTargets[0].id;
	            }
	            else {
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
	            index_1.CheckoutEnergy(creep);
	        }
	    }
	    static resolveBuild(creep, res, target) {
	        switch (res) {
	            case ERR_NOT_IN_RANGE:
	                creep.moveTo(target);
	                break;
	            case ERR_INVALID_TARGET:
	                if (target && target.hits && target.hits < target.hitsMax) {
	                    res = creep.repair(target);
	                    Builder.resolveRepair(creep, res, target);
	                }
	                else {
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
	var recover_1 = __webpack_require__(6);
	exports.Recover = recover_1.Recover;
	var distribute_1 = __webpack_require__(7);
	exports.Distribute = distribute_1.Distribute;
	var checkoutEnergy_1 = __webpack_require__(8);
	exports.CheckoutEnergy = checkoutEnergy_1.CheckoutEnergy;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function Harvest(creep) {
	    let target = creep.pos.findClosestByPath(FIND_SOURCES);
	    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
	        creep.moveTo(target);
	    }
	    return target;
	}
	exports.Harvest = Harvest;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	function Recover(creep) {
	    let harvesters = Memory['roster']['harvester'];
	    let needyHarvesters = _.filter(harvesters, (h) => Game.creeps[h].memory['distributors'].length === 0);
	    let greedyHarvesters = _.filter(harvesters, (h) => Game.creeps[h].memory['distributors'].length > 1);
	    if (needyHarvesters.length > 0 && greedyHarvesters.length > 0) {
	        let surplus = Game.creeps[greedyHarvesters[0]].memory.distributors;
	        let reassigned = _.takeRight(surplus)[0];
	        delete Game.creeps[reassigned].memory.harvester;
	    }
	    if (creep.memory.harvester && creep.carry.energy < creep.carryCapacity) {
	        let h = Game.creeps[creep.memory.harvester];
	        if (!h) {
	            delete creep.memory.harvester;
	            console.log('Removed stale harvester from ' + creep.name);
	            return;
	        }
	        let droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 10);
	        if (droppedEnergy.length) {
	            if (creep.pickup(droppedEnergy[0]) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(droppedEnergy[0]);
	            }
	        }
	        else {
	            if (creep.pos.getRangeTo(h) > 1) {
	                creep.moveTo(h);
	                return;
	            }
	        }
	        h.transfer(creep, RESOURCE_ENERGY);
	    }
	    else if (!creep.memory.harvester) {
	        if (!harvesters || harvesters.length === 0) {
	            console.log('No harvesters to assign ' + creep.name + ' to.');
	            return;
	        }
	        let sorted = _.sortBy(harvesters, (h) => {
	            let harvester = Game.creeps[h];
	            if (!harvester.memory.distributors) {
	                harvester.memory.distributors = [];
	            }
	            return harvester.memory.distributors.length;
	        });
	        creep.memory.harvester = sorted[0];
	        Game.creeps[sorted[0]].memory.distributors.push(creep.name);
	    }
	}
	exports.Recover = Recover;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function Distribute(creep) {
	    if (!creep.memory.target && creep.carry.energy === creep.carryCapacity) {
	        let targets = creep.room.find(FIND_STRUCTURES, {
	            filter: (structure) => {
	                switch (structure.structureType) {
	                    case STRUCTURE_TOWER:
	                    case STRUCTURE_EXTENSION:
	                    case STRUCTURE_SPAWN:
	                    case STRUCTURE_CONTAINER:
	                        return structure.energy < structure.energyCapacity;
	                    case STRUCTURE_STORAGE:
	                        let s = structure;
	                        return s.store.energy < s.storeCapacity;
	                    default:
	                        return false;
	                }
	            }
	        });
	        if (targets.length > 0) {
	            let tower = _.find(targets, (s) => {
	                return s.structureType === STRUCTURE_TOWER
	                    && s.energy < s.energyCapacity * 0.85;
	            });
	            if (tower) {
	                creep.memory.target = tower.id;
	            }
	            else {
	                let secondaryTargets = _.filter(targets, (s) => {
	                    return s.structureType === STRUCTURE_STORAGE
	                        && s.store.energy < 500;
	                });
	                let primaryTargets = _.difference(targets, secondaryTargets);
	                let closest = creep.pos.findClosestByPath(primaryTargets);
	                if (!closest) {
	                    closest = creep.pos.findClosestByPath(secondaryTargets);
	                }
	                if (closest) {
	                    creep.memory.target = closest.id;
	                }
	            }
	        }
	    }
	    if (creep.memory.target) {
	        let t = Game.getObjectById(creep.memory.target);
	        let res = creep.transfer(t, RESOURCE_ENERGY);
	        switch (res) {
	            case OK:
	                delete creep.memory.target;
	                break;
	            case ERR_NOT_IN_RANGE:
	                creep.moveTo(t);
	                break;
	        }
	    }
	}
	exports.Distribute = Distribute;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	function CheckoutEnergy(creep) {
	    let containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
	        filter: (structure) => {
	            switch (structure.structureType) {
	                case STRUCTURE_EXTENSION:
	                case STRUCTURE_SPAWN:
	                case STRUCTURE_CONTAINER:
	                    return structure.energy > 0;
	                case STRUCTURE_STORAGE:
	                    return structure.store.energy > 0;
	                default:
	                    return false;
	            }
	        }
	    });
	    if (containersWithEnergy.length > 0) {
	        if (containersWithEnergy.length > 0) {
	            let target = creep.pos.findClosestByPath(containersWithEnergy);
	            if (!target) {
	                return;
	            }
	            let res;
	            switch (target.structureType) {
	                case STRUCTURE_SPAWN:
	                case STRUCTURE_EXTENSION:
	                    res = target.transferEnergy(creep);
	                    break;
	                case STRUCTURE_CONTAINER:
	                case STRUCTURE_STORAGE:
	                    res = target.transfer(creep, RESOURCE_ENERGY);
	                    break;
	            }
	            if (res === ERR_NOT_IN_RANGE) {
	                creep.moveTo(target);
	            }
	        }
	    }
	}
	exports.CheckoutEnergy = CheckoutEnergy;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	class Harvester {
	    static run(creep) {
	        if (!creep.memory.target) {
	            let sourceIds = _.map(creep.room.find(FIND_SOURCES), (s) => s.id);
	            let harvestersWithTargets = _.filter(_.values(Game.creeps), (c) => {
	                return c.memory
	                    && c.memory.role === 'harvester'
	                    && c.memory.target;
	            });
	            let targets = _.map(harvestersWithTargets, (c) => c.memory.target);
	            let freeTargets = _.difference(sourceIds, targets);
	            if (freeTargets && freeTargets.length > 0) {
	                creep.memory.target = freeTargets[0];
	            }
	        }
	        if (creep.memory.target) {
	            let target = Game.getObjectById(creep.memory.target);
	            let res = creep.harvest(target);
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
	}
	exports.Harvester = Harvester;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(4);
	class Upgrader {
	    static run(creep) {
	        if (creep.memory.upgrading && creep.carry.energy === 0) {
	            creep.memory.upgrading = false;
	            creep.say('getting energy');
	        }
	        else if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
	            creep.memory.upgrading = true;
	            creep.say('upgrading');
	        }
	        if (creep.memory.upgrading && creep.room.controller) {
	            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(creep.room.controller);
	            }
	        }
	        else {
	            index_1.CheckoutEnergy(creep);
	        }
	    }
	}
	exports.Upgrader = Upgrader;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(4);
	class Distributor {
	    static run(creep) {
	        if (creep.carry.energy < creep.carryCapacity) {
	            index_1.Recover(creep);
	        }
	        else {
	            index_1.Distribute(creep);
	        }
	    }
	}
	exports.Distributor = Distributor;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const index_1 = __webpack_require__(4);
	class Serf {
	    static run(creep) {
	        if (creep.carry.energy < creep.carryCapacity) {
	            index_1.Harvest(creep);
	        }
	        else {
	            index_1.Distribute(creep);
	        }
	    }
	}
	exports.Serf = Serf;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	class Healer {
	    static run(creep) {
	        if (!creep.memory.target) {
	            let damagedCreeps = creep.room.find(FIND_MY_CREEPS, {
	                filter: (c) => c.hits < c.hitsMax
	            });
	            let damagedArchers = _.filter(damagedCreeps, (c) => {
	                return c.memory.role === 'archer';
	            });
	            if (damagedArchers.length > 0) {
	                let closest = creep.pos.findClosestByRange(damagedArchers);
	                creep.memory.target = closest.id;
	            }
	            else if (damagedCreeps.length > 0) {
	                let closest = creep.pos.findClosestByRange(damagedCreeps);
	                creep.memory.target = closest.id;
	            }
	        }
	        if (creep.memory.target) {
	            let target = Game.getObjectById(creep.memory.target);
	            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(target);
	            }
	            else if (target.hits < target.hitsMax) {
	                delete creep.memory.target;
	            }
	        }
	    }
	}
	exports.Healer = Healer;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	class Spawner {
	    static cleanup() {
	        for (let name in Memory.creeps) {
	            if (!Game.creeps[name]) {
	                let role = Memory.creeps[name].role;
	                Memory['roster'][role] = _.reject(Memory['roster'][role], (c) => c === name);
	                delete Memory.creeps[name];
	                console.log('Clearing non-existing creep memory:', name);
	            }
	            else if (Game.creeps[name].memory.role === 'harvester') {
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
	    static autoSpawn() {
	        let blueprints = [
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
	                max: 6,
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
	                max: 4,
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
	                max: 2,
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
	        if ((!Memory['roster']['harvester']
	            || Memory['roster']['harvester'].length === 0)
	            && !Game.spawns['Spawn1'].canCreateCreep(blueprints[0].tiers[0].capabilities)) {
	            blueprints = [
	                {
	                    name: 'serf',
	                    min: 1,
	                    max: 3,
	                    tiers: [
	                        {
	                            cost: 200,
	                            capabilities: [WORK, CARRY, MOVE]
	                        }
	                    ]
	                }
	            ];
	        }
	        else if (Memory['roster']['serf']
	            && Memory['roster']['serf'].length > 0
	            && Memory['roster']['harvester']
	            && Memory['roster']['harvester'].length > 0) {
	            _.each(Memory['roster']['serf'], (serfName) => {
	                Game.creeps[serfName].memory.role = 'distributor';
	            });
	        }
	        if (Spawner.fulfillCreepOrders(blueprints, 'min')) {
	            if (Spawner.fulfillCreepOrders(blueprints, 'max')) {
	                console.log('Maximum creep order fulfilled.');
	            }
	        }
	        ;
	    }
	    static fulfillCreepOrders(blueprints, type) {
	        let fulfilled = true;
	        for (let i = 0; i < blueprints.length; i++) {
	            let blueprint = blueprints[i];
	            let existing = Memory['roster'][blueprint.name];
	            if ((!existing && blueprint[type] > 0) || (existing && existing.length < blueprint[type])) {
	                let spawn = Game.spawns['Spawn1'];
	                for (let i = 0; i < blueprint.tiers.length; i++) {
	                    if (Spawner.tryCreateCreep(spawn, blueprint, i)) {
	                        break;
	                    }
	                    ;
	                }
	                fulfilled = false;
	                break;
	            }
	        }
	        return fulfilled;
	    }
	    static tryCreateCreep(spawn, blueprint, tierIndex) {
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
	exports.Spawner = Spawner;


/***/ }
/******/ ]);