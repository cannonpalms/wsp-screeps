var BCF = require("creep.AI.basefunctions");

var defender = function(creep){
    defendRoom = creep.memory.defendRoom;
    roomCenter = new RoomPosition(25, 25, defendRoom);
    
    if(creep.room.name !== defendRoom){
        creep.moveTo(roomCenter);
        creep.memory.travelTicks++;
    }
    else{
        var baddie = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(baddie){
            BCF.action(creep,creep.attack,[baddie],{maxRooms:1}); 
            creep.moveTo(baddie);
            return;
        }
        else{
            creep.moveTo(roomCenter);            
        }
    }


}

module.exports = defender