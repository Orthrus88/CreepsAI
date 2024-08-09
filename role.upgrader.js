var helper = require('helper');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Check if the creep should start or stop upgrading
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            // Upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: { stroke: '#ffffff' },
                    costCallback: function(roomName, costMatrix) {
                        if (roomName === creep.room.name) {
                            return helper.createCostMatrix(creep.room);
                        }
                    }
                });
            }
        } else {
            // Harvest energy
            helper.assignSource(creep);
            var source = Game.getObjectById(creep.memory.sourceId);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                    costCallback: function(roomName, costMatrix) {
                        if (roomName === creep.room.name) {
                            return helper.createCostMatrix(creep.room);
                        }
                    }
                });
            }
        }
    }
};

module.exports = roleUpgrader;