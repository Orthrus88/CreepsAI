var roleRemoteHarvesterW37N45 = {

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
        
        // Set home, middle, and target rooms
        creep.memory.home = 'W38N44';
        creep.memory.middle = 'W37N44';
        creep.memory.target = 'W37N45';

        // Set state to collecting if empty
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 collect');
        }
        // Set state to working if full
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('🚚 deposit');
        }

        if (creep.memory.working) {
            // Full capacity, now transfer energy to structures in home room
            if (creep.room.name != creep.memory.home) {
                // Move back to home room through the middle room
                if (creep.room.name != creep.memory.middle) {
                    var exit = creep.room.findExitTo(creep.memory.middle);
                    if (exit !== ERR_NO_PATH) {
                        var exitPos = creep.pos.findClosestByRange(exit);
                        creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    var exit = creep.room.findExitTo(creep.memory.home);
                    if (exit !== ERR_NO_PATH) {
                        var exitPos = creep.pos.findClosestByRange(exit);
                        creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            } else {
                // Transfer energy to structures
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN || 
                                structure.structureType == STRUCTURE_TOWER) && 
                               structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    // Fallback to upgrading controller if no structures need energy
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        } else {
            // Move to target room through the middle room to collect
            if (creep.room.name != creep.memory.target) {
                if (creep.room.name != creep.memory.middle) {
                    var exit = creep.room.findExitTo(creep.memory.middle);
                    if (exit !== ERR_NO_PATH) {
                        var exitPos = creep.pos.findClosestByRange(exit);
                        creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                } else {
                    var exit = creep.room.findExitTo(creep.memory.target);
                    if (exit !== ERR_NO_PATH) {
                        var exitPos = creep.pos.findClosestByRange(exit);
                        creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            } else {
                // Prioritize collecting dropped energy or energy from tombstones
                var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: (tomb) => tomb.store[RESOURCE_ENERGY] > 0 && tomb.room.name === 'W37N45'
                });
                var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => resource.resourceType == RESOURCE_ENERGY && resource.room.name === 'W37N45'
                });

                if (tombstone) {
                    if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
                        return;
                    }
                } else if (droppedEnergy) {
                    if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' } });
                        return;
                    }
                } else {
                    // If no tombstones or dropped energy, harvest from sources in target room
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        }
    }
};

module.exports = roleRemoteHarvesterW37N45;