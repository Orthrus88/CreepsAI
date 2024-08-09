var helper = require('helper');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.ticksToLive < 50) {
            var spawn = Game.spawns['Spawn1'];
            if (creep.pos.isNearTo(spawn)) {
                spawn.recycleCreep(creep);
                return; // Skip further actions
            } else {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ff0000' } });
                return; // Skip further actions
            }
        }
        
        // Ensure the home attribute is set
        if (!creep.memory.home) {
            creep.memory.home = 'W38N44';
        }

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If no construction sites and in the home room, fallback to upgrading controller
                if (creep.room.name === creep.memory.home) {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    // Move back to the home room if not in the home room
                    var exitDir = Game.map.findExit(creep.room, creep.memory.home);
                    var exit = creep.pos.findClosestByRange(exitDir);
                    creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            helper.assignSource(creep);
            var source = Game.getObjectById(creep.memory.sourceId);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleBuilder;