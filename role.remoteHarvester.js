var roleRemoteHarvester = {

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

        // Set home and target rooms if not already set
        creep.memory.home = 'W38N44';
        creep.memory.target = 'W37N44';

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
                // Move back to home room
                var exit = creep.room.findExitTo(creep.memory.home);
                if (exit !== ERR_NO_PATH) {
                    var exitPos = creep.pos.findClosestByRange(exit);
                    creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffffff' } });
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
            // Ensure creep is in the target room before collecting or harvesting
            if (creep.room.name != creep.memory.target) {
                // Move to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                if (exit !== ERR_NO_PATH) {
                    var exitPos = creep.pos.findClosestByRange(exit);
                    creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                // Prioritize collecting dropped energy or energy from tombstones in target room
                var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: (tomb) => tomb.store[RESOURCE_ENERGY] > 0 && !_.some(Game.creeps, (c) => c.memory.targetResourceId == tomb.id)
                });
                var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => resource.resourceType == RESOURCE_ENERGY && !_.some(Game.creeps, (c) => c.memory.targetResourceId == resource.id)
                });

                if (tombstone) {
                    creep.memory.targetResourceId = tombstone.id;
                    if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                } else if (droppedEnergy) {
                    creep.memory.targetResourceId = droppedEnergy.id;
                    if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' } });
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

module.exports = roleRemoteHarvester;