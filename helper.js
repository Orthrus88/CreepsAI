var helper = {
    assignSource: function(creep) {
        if (!creep.memory.sourceId) {
            var sources = creep.room.find(FIND_SOURCES);
            var source = sources[0];
            if (sources.length > 1) {
                if (_.filter(Game.creeps, (c) => c.memory.sourceId == sources[0].id).length >
                    _.filter(Game.creeps, (c) => c.memory.sourceId == sources[1].id).length) {
                    source = sources[1];
                }
            }
            creep.memory.sourceId = source.id;
        }
    },

    createCostMatrix: function(room) {
        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function(structure) {
            if (structure.structureType === STRUCTURE_ROAD) {
                // Favor roads over plain tiles
                costs.set(structure.pos.x, structure.pos.y, 1);
            } else if (structure.structureType !== STRUCTURE_CONTAINER &&
                       (structure.structureType !== STRUCTURE_RAMPART ||
                        !structure.my)) {
                // Can't walk through non-walkable buildings
                costs.set(structure.pos.x, structure.pos.y, 255);
            }
        });

        // Avoid creeps in the room
        room.find(FIND_CREEPS).forEach(function(creep) {
            costs.set(creep.pos.x, creep.pos.y, 255);
        });

        return costs;
    }
};

module.exports = helper;