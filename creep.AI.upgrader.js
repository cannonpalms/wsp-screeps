var BCF = require("creep.AI.basefunctions");

var upgrader = function(creep){

    //check if container exists in memory
    var container = Game.getObjectById(creep.room.memory.container);   

    if(container){
        var target = container.pos;  
    }  
    else{
        var target = creep.room.controller.pos;
    }
            
    if(!BCF.goTo(creep,target,4)){
        var container = Game.getObjectById(creep.room.memory.container);        

        if(container){
            BCF.action(creep,creep.withdraw, [container,RESOURCE_ENERGY]);
            BCF.action(creep,creep.upgradeController, [creep.room.controller]);

            if(!creep.memory.standingSquare && !creep.pos.inRangeTo(creep.room.controller.pos,3)){
                creep.memory.standingSquare = findStandingSquare(creep.room.controller.pos,container.pos);                
            }
            
            if(creep.memory.standingSquare){
                creep.moveTo(creep.memory.standingSquare.x,creep.memory.standingSquare.y);
            }
            // if(container.hits < container.hitsMax){
            //     BCF.action(creep,creep.repair, [container]);
            // }
            // else{
            //     BCF.action(creep,creep.upgradeController, [creep.room.controller]);
            // }
        }
        else{
            BCF.action(creep,creep.upgradeController, [creep.room.controller]);
        }
    }
    else{
        creep.memory.travelTicks++;
    }
}

function findStandingSquare(controllerPos,containerPos){
    var pos = new RoomPosition(containerPos.x,containerPos.y,containerPos.roomName);
    
    for(var i=0;i<3;i++){
        pos.x = containerPos.x - 1 + i;
        
        for(var j=0;j<3;j++){
            pos.y = containerPos.y - 1 + j;
            //check if in range of controller
            if(pos.inRangeTo(controllerPos,3)){
                //check if currently has a creep
                var creepLook = pos.lookFor(LOOK_CREEPS);

                //check if is a wall
                var groundLook = pos.lookFor(LOOK_TERRAIN);

                if(groundLook != 'wall' && creepLook == ''){ 
                                
                    return {'x':pos.x,'y':pos.y};
                }
            }
        }
    }
    return null;
}

module.exports = upgrader;