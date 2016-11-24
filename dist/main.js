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
	const spawner_1 = __webpack_require__(19);
	const behaviours_1 = __webpack_require__(4);
	const scheduler_1 = __webpack_require__(20);
	const tasks_1 = __webpack_require__(21);
	const towers_1 = __webpack_require__(24);
	let scheduler = new scheduler_1.Scheduler();
	scheduler.schedule(new tasks_1.RoadBuilder());
	scheduler.schedule(new tasks_1.CacheCleaner());
	function loop() {
	    spawner_1.Spawner.cleanup();
	    for (let roomName in Game.rooms) {
	        towers_1.RunTowers(roomName);
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
	                console.log(`Invalid creep role on ${name}: ${creep.memory.role}`);
	        }
	        behaviours_1.ReportStep(creep);
	    }
	    scheduler.tick();
	    Memory['roster'] = creepRoster;
	    spawner_1.Spawner.autoSpawn();
	}
	exports.loop = loop;
	;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var archer_1 = __webpack_require__(2);
	exports.Archer = archer_1.Archer;
	var builder_1 = __webpack_require__(13);
	exports.Builder = builder_1.Builder;
	var harvester_1 = __webpack_require__(14);
	exports.Harvester = harvester_1.Harvester;
	var upgrader_1 = __webpack_require__(15);
	exports.Upgrader = upgrader_1.Upgrader;
	var distributor_1 = __webpack_require__(16);
	exports.Distributor = distributor_1.Distributor;
	var serf_1 = __webpack_require__(17);
	exports.Serf = serf_1.Serf;
	var healer_1 = __webpack_require__(18);
	exports.Healer = healer_1.Healer;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	const behaviours_1 = __webpack_require__(4);
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
	            behaviours_1.Idle(creep);
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
	                    util_1.MoveTo(creep, target);
	                    break;
	                case ERR_INVALID_TARGET:
	                    console.log('Invalid Target');
	                    delete creep.memory.target;
	                    break;
	            }
	        }
	    }
	}
	exports.Archer = Archer;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function GetPositionByDirection(pos, direction) {
	    let newPos = pos;
	    switch (direction) {
	        case (TOP_LEFT):
	            newPos.y--;
	            newPos.x--;
	            break;
	        case (TOP):
	            newPos.y--;
	            break;
	        case (TOP_RIGHT):
	            newPos.y--;
	            newPos.x++;
	            break;
	        case (LEFT):
	            newPos.x--;
	            break;
	        case (RIGHT):
	            newPos.x++;
	            break;
	        case (BOTTOM_LEFT):
	            newPos.y++;
	            newPos.x--;
	            break;
	        case (BOTTOM):
	            newPos.y++;
	            break;
	        case (BOTTOM_RIGHT):
	            newPos.y++;
	            newPos.x++;
	            break;
	    }
	    return newPos;
	}
	exports.GetPositionByDirection = GetPositionByDirection;
	function MoveTo(creep, target) {
	    if (!Memory['routeCache']) {
	        Memory['routeCache'] = {};
	    }
	    let start = creep.pos;
	    let end = target;
	    if (!!target.pos) {
	        end = target.pos;
	    }
	    let startKey = `${start.roomName}_${start.x}_${start.y}`;
	    let endKey = `${end.roomName}_${end.x}_${end.y}`;
	    let res;
	    if (startKey === creep.memory.lastPos) {
	        console.log(`${creep.name} may be stuck.  Recalculating path...`);
	        res = creep.moveTo(target);
	    }
	    else {
	        let cacheKey = `${startKey}:${endKey}`;
	        if (!Memory['routeCache'][cacheKey]) {
	            let route = Game.rooms[start.roomName].findPath(start, end, {
	                ignoreCreeps: true
	            });
	            let firstStep = route[0];
	            Memory['routeCache'][cacheKey] = firstStep.direction;
	        }
	        res = creep.move(Memory['routeCache'][cacheKey]);
	    }
	    return res;
	}
	exports.MoveTo = MoveTo;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var harvest_1 = __webpack_require__(5);
	exports.Harvest = harvest_1.Harvest;
	var recover_1 = __webpack_require__(6);
	exports.Recover = recover_1.Recover;
	var recoverDropped_1 = __webpack_require__(7);
	exports.RecoverDropped = recoverDropped_1.RecoverDropped;
	var distribute_1 = __webpack_require__(8);
	exports.Distribute = distribute_1.Distribute;
	var checkoutEnergy_1 = __webpack_require__(10);
	exports.CheckoutEnergy = checkoutEnergy_1.CheckoutEnergy;
	var idle_1 = __webpack_require__(11);
	exports.Idle = idle_1.Idle;
	var reportStep_1 = __webpack_require__(12);
	exports.ReportStep = reportStep_1.ReportStep;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	function Harvest(creep) {
	    if (!creep.memory.target) {
	        let sourceIds = _.map(creep.room.find(FIND_SOURCES), (s) => s.id);
	        let harvestersWithTargets = _.filter(_.values(Game.creeps), (c) => {
	            return c.memory
	                && c.memory.role === creep.memory.role
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
	                util_1.MoveTo(creep, target);
	                break;
	            case ERR_INVALID_TARGET:
	                delete creep.memory.target;
	                break;
	        }
	    }
	}
	exports.Harvest = Harvest;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	const recoverDropped_1 = __webpack_require__(7);
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
	        if (!recoverDropped_1.RecoverDropped(creep)) {
	            if (creep.pos.getRangeTo(h) > 1) {
	                util_1.MoveTo(creep, h);
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	function RecoverDropped(creep) {
	    let droppedEnergy = _.sortBy(creep.room.find(FIND_DROPPED_ENERGY, {
	        filter: (x) => {
	            return x.energy > 1000;
	        }
	    }), (x) => {
	        return 0 - x.energy;
	    });
	    if (droppedEnergy.length === 0) {
	        droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 10);
	    }
	    if (droppedEnergy.length) {
	        if (creep.pickup(droppedEnergy[0]) === ERR_NOT_IN_RANGE) {
	            util_1.MoveTo(creep, droppedEnergy[0]);
	        }
	        return true;
	    }
	    return false;
	}
	exports.RecoverDropped = RecoverDropped;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	const cacheHelper_1 = __webpack_require__(9);
	const util_2 = __webpack_require__(3);
	function Distribute(creep, includeTower = true) {
	    let daisyChain = (creep) => {
	        if (creep.memory._move) {
	            let direction = parseInt(creep.memory._move.path.substr(0, 1));
	            let dest = util_2.GetPositionByDirection(creep.pos, direction);
	            let adjacentCreeps = dest.lookFor(LOOK_CREEPS);
	            if (adjacentCreeps && adjacentCreeps.length > 0) {
	                let adjacentCreep = adjacentCreeps[0];
	                if (adjacentCreep.memory['role'] === 'distributor') {
	                    console.log(`Daisychaining from ${creep.name} to ${adjacentCreep.name}`);
	                    creep.transfer(adjacentCreep, RESOURCE_ENERGY);
	                    delete creep.memory._move;
	                    delete adjacentCreep.memory._move;
	                    delete creep['memory']['target'];
	                    delete adjacentCreep['memory']['target'];
	                }
	            }
	        }
	    };
	    if (!creep.memory.target && creep.carry.energy === creep.carryCapacity) {
	        let cacheKey = `${creep.room.name}_distributeTargets`;
	        let targets = cacheHelper_1.Cache.get(cacheKey, () => creep.room.find(FIND_STRUCTURES, {
	            filter: (structure) => {
	                switch (structure.structureType) {
	                    case STRUCTURE_TOWER:
	                    case STRUCTURE_EXTENSION:
	                    case STRUCTURE_SPAWN:
	                    case STRUCTURE_STORAGE:
	                        return structure.energy < structure.energyCapacity;
	                    case STRUCTURE_CONTAINER:
	                    case STRUCTURE_STORAGE:
	                        let s = structure;
	                        return s.store.energy < s.storeCapacity;
	                    default:
	                        return false;
	                }
	            }
	        }));
	        if (targets && targets.length > 0) {
	            let tower;
	            if (!!includeTower) {
	                tower = _.find(targets, (s) => {
	                    return s.structureType === STRUCTURE_TOWER
	                        && s.energy < s.energyCapacity * 0.85;
	                });
	            }
	            if (!!tower) {
	                creep.memory.target = tower.id;
	            }
	            else {
	                let secondaryTargets = _.filter(targets, (s) => {
	                    return s.structureType === STRUCTURE_STORAGE
	                        || s.structureType === STRUCTURE_TOWER;
	                });
	                let primaryTargets = _.difference(targets, secondaryTargets);
	                let closest = creep.pos.findClosestByPath(primaryTargets);
	                if (!closest) {
	                    closest = creep.pos.findClosestByPath(secondaryTargets);
	                }
	                if (closest) {
	                    creep.memory.target = closest.id;
	                }
	                else {
	                    console.log(`${creep.name} has no path to target`);
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
	                let res = util_1.MoveTo(creep, t);
	                if (res === ERR_NO_PATH) {
	                    daisyChain(creep);
	                }
	                break;
	            case ERR_FULL:
	            case ERR_INVALID_TARGET:
	                delete creep.memory.target;
	                break;
	        }
	    }
	}
	exports.Distribute = Distribute;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	class Cache {
	    static get(cacheKey, dataFn = null) {
	        let res = Memory['cache'][cacheKey];
	        if (!res) {
	            if (dataFn !== null) {
	                res = dataFn();
	                if (res.id) {
	                    res = res.id;
	                }
	                else if (res.length && res[0] && res[0].id) {
	                    res = res.map((x) => x.id);
	                }
	                Memory['cache'][cacheKey] = res;
	            }
	            else {
	                console.log(`Error caching ${cacheKey}.  No dataFn defined.`);
	            }
	        }
	        if (res.length) {
	            res = res.map((x) => Game.getObjectById(x));
	        }
	        else {
	            res = Game.getObjectById(res);
	        }
	        return res;
	    }
	}
	exports.Cache = Cache;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	function CheckoutEnergy(creep) {
	    if (!Memory['roster']['harvester'] || Memory['roster']['harvester'].length < 2) {
	        creep.memory.energyFreeze = true;
	        return;
	    }
	    else {
	        delete creep.memory.energyFreeze;
	    }
	    let containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
	        filter: (structure) => {
	            switch (structure.structureType) {
	                case STRUCTURE_EXTENSION:
	                case STRUCTURE_SPAWN:
	                    return structure.energy > 0;
	                case STRUCTURE_CONTAINER:
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
	                util_1.MoveTo(creep, target);
	            }
	        }
	    }
	}
	exports.CheckoutEnergy = CheckoutEnergy;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	function Idle(creep) {
	    if (!creep.pos.inRangeTo(Game.flags['camp'].pos, 3)) {
	        util_1.MoveTo(creep, Game.flags['camp']);
	    }
	}
	exports.Idle = Idle;
	;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	function ReportStep(creep) {
	    let posKey = `${creep.pos.roomName}_${creep.pos.x}_${creep.pos.y}`;
	    if (creep.memory.lastPos === posKey) {
	        return;
	    }
	    creep.memory.lastPos = posKey;
	    if (!Memory['paths']) {
	        Memory['paths'] = {};
	    }
	    if (!Memory['paths'][posKey]) {
	        Memory['paths'][posKey] = {
	            room: creep.pos.roomName,
	            x: creep.pos.x,
	            y: creep.pos.y,
	            count: 1
	        };
	    }
	    else if (Memory['paths'][posKey]['count'] >= 0) {
	        Memory['paths'][posKey]['count']++;
	    }
	}
	exports.ReportStep = ReportStep;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	const index_1 = __webpack_require__(4);
	const cacheHelper_1 = __webpack_require__(9);
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
	            let cacheKey = `${creep.room.name}_buildTargets`;
	            let buildTargets = cacheHelper_1.Cache.get(cacheKey, () => {
	                return creep.room.find(FIND_CONSTRUCTION_SITES);
	            });
	            if (buildTargets && buildTargets.length > 0) {
	                let secondaryTargets = _.filter(buildTargets, (tgt) => {
	                    return tgt.structureType !== STRUCTURE_EXTENSION;
	                });
	                let primaryTargets = _.difference(buildTargets, secondaryTargets);
	                let target;
	                if (primaryTargets.length > 0) {
	                    target = creep.pos.findClosestByPath(primaryTargets);
	                }
	                else {
	                    target = creep.pos.findClosestByPath(secondaryTargets);
	                }
	                if (!!target) {
	                    creep.memory.target = target.id;
	                }
	            }
	            else {
	                let cacheKey = `${creep.room.name}_repairTargets`;
	                let repairTargets = cacheHelper_1.Cache.get(cacheKey, () => creep.room.find(FIND_STRUCTURES, {
	                    filter: (object) => object.hits < object.hitsMax
	                }));
	                if (repairTargets && repairTargets.length > 0) {
	                    let closestByPath = creep.pos.findClosestByPath(repairTargets);
	                    if (!!closestByPath) {
	                        creep.memory.target = creep.pos.findClosestByPath(repairTargets).id;
	                    }
	                }
	                else {
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
	                util_1.MoveTo(creep, target);
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
	                util_1.MoveTo(creep, target);
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const behaviours_1 = __webpack_require__(4);
	class Harvester {
	    static run(creep) {
	        behaviours_1.Harvest(creep);
	    }
	}
	exports.Harvester = Harvester;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
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
	                util_1.MoveTo(creep, creep.room.controller);
	            }
	        }
	        else {
	            index_1.CheckoutEnergy(creep);
	        }
	    }
	}
	exports.Upgrader = Upgrader;


/***/ },
/* 16 */
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	const index_1 = __webpack_require__(4);
	class Serf {
	    static run(creep) {
	        if (creep.carry.energy < creep.carryCapacity) {
	            if (index_1.RecoverDropped(creep)) {
	                return;
	            }
	            if (!creep.memory.target) {
	                let target = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
	                creep.memory.target = target.id;
	            }
	            if (creep.memory.target) {
	                let target = Game.getObjectById(creep.memory.target);
	                let res = creep.harvest(target);
	                switch (res) {
	                    case ERR_NOT_IN_RANGE:
	                        util_1.MoveTo(creep, target);
	                        break;
	                    case ERR_INVALID_TARGET:
	                        delete creep.memory.target;
	                        break;
	                }
	            }
	        }
	        else {
	            index_1.Distribute(creep, false);
	        }
	    }
	}
	exports.Serf = Serf;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const util_1 = __webpack_require__(3);
	const behaviours_1 = __webpack_require__(4);
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
	                util_1.MoveTo(creep, target);
	            }
	            else if (target.hits < target.hitsMax) {
	                delete creep.memory.target;
	            }
	        }
	        else {
	            behaviours_1.Idle(creep);
	        }
	    }
	}
	exports.Healer = Healer;


/***/ },
/* 19 */
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
	        let blueprints = this.blueprints;
	        if ((!Memory['roster']['harvester']
	            || Memory['roster']['harvester'].length === 0)
	            && Game.spawns['Spawn1'].canCreateCreep(blueprints[0].tiers[2].capabilities) !== OK) {
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
	        }
	        else if (Memory['roster']['serf']
	            && Memory['roster']['serf'].length > 0
	            && Memory['roster']['harvester']
	            && Memory['roster']['harvester'].length > 0) {
	            _.each(Memory['roster']['serf'], (serfName) => {
	                Game.creeps[serfName].memory.role = 'distributor';
	            });
	        }
	        if (this.fulfillCreepOrders(blueprints, 'min')) {
	            if (this.fulfillCreepOrders(blueprints, 'max')) {
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
	                    if (this.tryCreateCreep(spawn, blueprint, i)) {
	                        break;
	                    }
	                    else {
	                        if (spawn.room.energyCapacityAvailable >= blueprint.tiers[i].cost
	                            && ((Memory['roster']['serf'] &&
	                                Memory['roster']['serf'].length > 0)
	                                ||
	                                    (Memory['roster']['harvester'] &&
	                                        Memory['roster']['harvester'].length > 0 &&
	                                        Memory['roster']['distributor'] &&
	                                        Memory['roster']['distributor'].length > 0))) {
	                            console.log(`Need ${blueprint.tiers[i].cost} energy to spawn ${blueprint.name}`
	                                + ` but ${spawn.name} has ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}.`
	                                + ` Waiting for more energy.`);
	                            break;
	                        }
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
	        if (blueprint.force
	            || blueprint.name === 'harvester'
	            || Memory['enoughEnergyInReserve']
	            || (Memory['roster']['harvester']
	                && Memory['roster']['harvester'].length > 0)) {
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
	Spawner.blueprints = [
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
	exports.Spawner = Spawner;


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	class Scheduler {
	    constructor() {
	        this.taskArray = {};
	        if (!Memory['scheduledTasks']) {
	            Memory['scheduledTasks'] = {};
	        }
	    }
	    tick() {
	        let currentTick = Game.time;
	        let self = this;
	        _.forEach(Memory['scheduledTasks'], function (task) {
	            if (currentTick % task.interval === 0) {
	                console.log(`Running: ${task.name}`);
	                self.taskArray[task.name].run();
	            }
	        });
	    }
	    schedule(task) {
	        Memory['scheduledTasks'][task.name] = {
	            name: task.name,
	            interval: task.interval
	        };
	        this.taskArray[task.name] = task;
	    }
	    unschedule(key) {
	        delete Memory['scheduledTasks'][key];
	    }
	}
	exports.Scheduler = Scheduler;
	;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var roadBuilder_1 = __webpack_require__(22);
	exports.RoadBuilder = roadBuilder_1.RoadBuilder;
	var cacheCleaner_1 = __webpack_require__(23);
	exports.CacheCleaner = cacheCleaner_1.CacheCleaner;


/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	class RoadBuilder {
	    constructor() {
	        this.name = 'ROAD_BUILDER';
	        this.interval = 200;
	    }
	    run() {
	        let highPriorityPaths = _.filter(Memory['paths'], (path) => {
	            return path.count > 10;
	        });
	        let sorted = _.sortBy(highPriorityPaths, (path) => {
	            return 0 - path.count;
	        });
	        let top3 = _.take(sorted, 3);
	        _.each(top3, (path) => {
	            console.log(path.x, path.y, path.room);
	            let pos = new RoomPosition(path.x, path.y, path.room);
	            let res = pos.createConstructionSite(STRUCTURE_ROAD);
	            let posKey = `${path.room}_${path.x}_${path.y}`;
	            if (res === OK) {
	                console.log(`Building road at ${posKey}`);
	            }
	            else {
	                console.log(`Cannot build road at ${posKey}: ${res}`);
	            }
	            console.log(posKey);
	            Memory['paths'][posKey].count = -1;
	        });
	    }
	}
	exports.RoadBuilder = RoadBuilder;
	;


/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	class CacheCleaner {
	    constructor() {
	        this.name = 'CACHE_CLEANER';
	        this.interval = 5;
	    }
	    run() {
	        Memory['cache'] = {};
	    }
	}
	exports.CacheCleaner = CacheCleaner;


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	function RunTowers(roomName) {
	    var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	    for (let i = 0; i < towers.length; i++) {
	        let tower = towers[i];
	        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (closestHostile) {
	            tower.attack(closestHostile);
	        }
	        else {
	            let crumblingWalls = tower.room.find(FIND_STRUCTURES, {
	                filter: (structure) => {
	                    return structure.structureType === STRUCTURE_WALL
	                        && ((structure.hits < 50000) && (structure.hits > 0));
	                }
	            });
	            if (crumblingWalls.length > 0) {
	                let target = _.sortBy(crumblingWalls, (wall) => {
	                    return wall.hits;
	                })[0];
	                tower.repair(target);
	            }
	            else if (tower.energy > tower.energyCapacity * 0.85) {
	                let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	                    filter: (structure) => structure.hits < structure.hitsMax
	                });
	                if (closestDamagedStructure) {
	                    tower.repair(closestDamagedStructure);
	                }
	            }
	        }
	    }
	}
	exports.RunTowers = RunTowers;


/***/ }
/******/ ]);