var helper = require('helper');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Clear the say flag if the action has changed
        if (creep.memory.lastAction && creep.memory.lastAction !== creep.memory.currentAction) {
            delete creep.memory.saidAction;
        }

        // Check for recycling
        if (creep.ticksToLive < 50) {
            var spawn = Game.spawns['Spawn1'];
            creep.memory.currentAction = 'recycle';
            if (creep.pos.isNearTo(spawn)) {
                if (!creep.memory.saidAction) {
                    creep.say('♻️ recycle');
                    creep.memory.saidAction = true;
                }
                spawn.recycleCreep(creep);
                return; // Skip further actions
            } else {
                if (!creep.memory.saidAction) {
                    creep.say('🚶 to recycle');
                    creep.memory.saidAction = true;
                }
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ff0000' } });
                return; // Skip further actions
            }
        }

        // Reset action states when switching between harvesting and transferring
        if (creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            creep.memory.lastAction = null;
            delete creep.memory.targetResourceId;
        }

        if (!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
            creep.memory.transferring = true;
            delete creep.memory.targetResourceId;
        }

        if (creep.memory.transferring) {
            // Transferring energy
            creep.memory.currentAction = 'transfer';
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_CONTAINER) &&
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    if (!creep.memory.saidAction) {
                        creep.say('🚶 transfer');
                        creep.memory.saidAction = true;
                    }
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                } else {
                    if (!creep.memory.saidAction) {
                        creep.say('🔋 transfer');
                        creep.memory.saidAction = true;
                    }
                }
            } else {
                // All structures are full, fallback to building
                creep.memory.currentAction = 'build';
                var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (constructionSite) {
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        if (!creep.memory.saidAction) {
                            creep.say('🚶 build');
                            creep.memory.saidAction = true;
                        }
                        creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
                    } else {
                        if (!creep.memory.saidAction) {
                            creep.say('🚧 build');
                            creep.memory.saidAction = true;
                        }
                    }
                } else {
                    // No construction sites, fallback to upgrading controller
                    creep.memory.currentAction = 'upgrade';
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        if (!creep.memory.saidAction) {
                            creep.say('🚶 upgrade');
                            creep.memory.saidAction = true;
                        }
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    } else {
                        if (!creep.memory.saidAction) {
                            creep.say('⚡ upgrade');
                            creep.memory.saidAction = true;
                        }
                    }
                }
            }
        } else {
            // Harvesting or collecting energy
            var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: (tomb) => tomb.store[RESOURCE_ENERGY] > 0 && !_.some(Game.creeps, (c) => c.memory.targetResourceId == tomb.id)
            });
            var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType == RESOURCE_ENERGY && !_.some(Game.creeps, (c) => c.memory.targetResourceId == resource.id)
            });

            if (tombstone) {
                creep.memory.currentAction = 'collectTomb';
                creep.memory.targetResourceId = tombstone.id;
                if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    if (!creep.memory.saidAction) {
                        creep.say('🚶 tomb');
                        creep.memory.saidAction = true;
                    }
                    creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    if (!creep.memory.saidAction) {
                        creep.say('⛏️ tomb');
                        creep.memory.saidAction = true;
                    }
                }
            } else if (droppedEnergy) {
                creep.memory.currentAction = 'pickupEnergy';
                creep.memory.targetResourceId = droppedEnergy.id;
                if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    if (!creep.memory.saidAction) {
                        creep.say('🚶 pickup');
                        creep.memory.saidAction = true;
                    }
                    creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    if (!creep.memory.saidAction) {
                        creep.say('⛏️ pickup');
                        creep.memory.saidAction = true;
                    }
                }
            } else {
                creep.memory.currentAction = 'harvest';
                helper.assignSource(creep);
                var source = Game.getObjectById(creep.memory.sourceId);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    if (!creep.memory.saidAction) {
                        creep.say('🚶 harvest');
                        creep.memory.saidAction = true;
                    }
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    if (!creep.memory.saidAction) {
                        creep.say('⛏️ harvest');
                        creep.memory.saidAction = true;
                    }
                }
            }
        }

        // Remember the last action for comparison on the next tick
        creep.memory.lastAction = creep.memory.currentAction;
    }
};

module.exports = roleHarvester;