var BCF = require("creep.AI.basefunctions");

var reserver = function(creep){
    claimRoom = creep.memory.claimRoom;
    // creep.memory.travelTicks = 0;
    
    if(creep.room.name !== claimRoom){
        creep.moveTo(new RoomPosition(25, 25, claimRoom));
        // creep.memory.travelTicks++;
    }
    else{
        retVal = BCF.action(creep,creep.reserveController,[creep.room.controller]);
        // if(retVal === ERR_NOT_IN_RANGE)
            // creep.memory.travelTicks++;
    }


}

module.exports = reserver