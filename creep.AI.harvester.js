var BCF = require("creep.AI.basefunctions");

var harvester = function(creep){

    var source = Game.getObjectById(creep.memory.resource);

    if(creep.memory.creepType === 'harvester'){
        var containerID = creep.room.memory.sources[creep.memory.resource].container;
        var container = Game.getObjectById(containerID);
    }
    else{
        var container = null;
    }

    // creep.memory.resource = '90fa35020b60982';

    if(source){
        var sourcePos = source.pos;
    }
    else{
        var sourcePos = new RoomPosition(creep.memory.resourcePos.x,creep.memory.resourcePos.y,creep.memory.resourcePos.room);
    }



    if(!creep.spawning && !BCF.goTo(creep,sourcePos,2)){
        if(container && (container.pos.x !== creep.pos.x || container.pos.y !== creep.pos.y)){
            //If not standing on container.  Move to it.
            // creep.memory.travelTicks++;
            creep.moveTo(container);
        }

        BCF.action(creep,creep.harvest,[source]);

        // if(creep.carry.energy < 50){ 
        //     if(BCF.action(creep,creep.harvest,[source]) == ERR_NOT_IN_RANGE){
        //         // creep.memory.travelTicks++;
        //     }
        // }
        // else{
        //     BCF.action(creep,creep.harvest,[source]);
        //     BCF.action(creep,creep.drop,[RESOURCE_ENERGY]);
            // if(container && container.hits < container.hitsMax){
            //     BCF.action(creep,creep.repair, [container]);
            // }
            // else{
            //     BCF.action(creep,creep.harvest,[source]);
            //     BCF.action(creep,creep.drop,[RESOURCE_ENERGY]); 
            // }
        // }
    }
    else{
        creep.memory.travelTicks++;
    }
}

module.exports = harvester;