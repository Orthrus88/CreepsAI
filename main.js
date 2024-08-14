var roleExplorer = require('role.explorer');
var roleRemoteHarvester = require('role.remoteHarvester');
var roleRemoteHarvesterW37N45 = require('role.remoteHarvester.W37N45');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleRepairer = require('role.repairer');
var roleRangedAttacker = require('role.rangedAttacker');
var roleTower = require('role.tower');
var helper = require('helper');
var roleHydrogenHarvester = require('role.hydrogenHarvester');

const bodyHarvester = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
const bodyRemoteHarvester = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
const bodyRemoteHarvesterW37N45 = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
const bodyUpgrader = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
const bodyBuilder = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
const bodyDefender = [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
const bodyRepairer = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
const bodyExplorer = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH];
const bodyRangedAttacker = [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
const bodyHydrogenHarvester = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];

const targetRoom = 'W38N45';
const homeRoom = 'W38N44';

module.exports.loop = function () {
    // Clean up memory for dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Count current creeps by role
    var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var remoteHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvester');
    var remoteHarvestersW37N45 = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvesterW37N45');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var rangedAttackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedAttacker');
    var hydrogenHarvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'hydrogenHarvester')

    // Set max creep numbers
    const maxExplorers = 0;
    const maxHarvesters = 3;
    const maxRemoteHarvesters = 4;
    const maxRemoteHarvestersW37N45 = 0;
    const maxUpgraders = 4;
    const maxBuilders = 2;
    const maxDefenders = 2;
    const maxRepairers = 2;
    const maxRangedAttackers = 2;
    const maxHydrogenHarvesters = 1;

    // Prioritize spawning logic
    if (harvesters.length < maxHarvesters) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyHarvester, newName,
            { memory: { role: 'harvester' } });
    } else if (remoteHarvesters.length < maxRemoteHarvesters) {
        var newName = 'RemoteHarvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyRemoteHarvester, newName,
            { memory: { role: 'remoteHarvester', home: 'W38N44', target: 'W37N44' } });
    } else if (remoteHarvestersW37N45.length < maxRemoteHarvestersW37N45) {
        var newName = 'RemoteHarvesterW37N45' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyRemoteHarvesterW37N45, newName,
            { memory: { role: 'remoteHarvesterW37N45', home: 'W38N44', target: 'W37N45' } });
    } else if (hydrogenHarvester.length < maxHydrogenHarvesters) {
        var newName = 'HydrogenHarvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyHydrogenHarvester, newName,
            { memory: { role: 'hydrogenHarvester' } });
    } else if (upgraders.length < maxUpgraders) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyUpgrader, newName,
            { memory: { role: 'upgrader' } });
    } else if (builders.length < maxBuilders) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyBuilder, newName,
            { memory: { role: 'builder', home: 'W38N44' } });
    } else if (defenders.length < maxDefenders) {
        var newName = 'Defender' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyDefender, newName,
            { memory: { role: 'defender' } });
    } else if (repairers.length < maxRepairers) {
        var newName = 'Repairer' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyRepairer, newName,
            { memory: { role: 'repairer' } });
    } else if (explorers.length < maxExplorers) {
        var newName = 'Explorer' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyExplorer, newName,
            { memory: { role: 'explorer' } });
    } else if (rangedAttackers.length < maxRangedAttackers) {
        var newName = 'RangedAttacker' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(bodyRangedAttacker, newName, 
            { memory: { role: 'rangedAttacker', home: homeRoom, targetRoom: targetRoom } });
    }

    // Remove walls blocking sources
    removeWallsBlockingSources(Game.spawns['Spawn1'].room);

    // Run creep roles
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'remoteHarvester') {
            roleRemoteHarvester.run(creep);
        }
        if (creep.memory.role == 'remoteHarvesterW37N45') {
            roleRemoteHarvesterW37N45.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'rangedAttacker') {
            roleRangedAttacker.run(creep);
        }

        // Creep recycling logic
        if (creep.ticksToLive < 50) {
            var spawn = Game.spawns['Spawn1'];
            if (creep.pos.isNearTo(spawn)) {
                spawn.recycleCreep(creep);
            } else {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ff0000' } });
            }
        }
    }

    // Tower control logic
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
    for (var tower of towers) {
        roleTower.run(tower);
    }
};

// Function to remove walls blocking sources
function removeWallsBlockingSources(room) {
    const sources = room.find(FIND_SOURCES);
    for (let source of sources) {
        const area = room.lookForAtArea(LOOK_STRUCTURES, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        for (let structure of area) {
            if (structure.structure.structureType === STRUCTURE_WALL) {
                structure.structure.destroy();
            }
        }
    }
}