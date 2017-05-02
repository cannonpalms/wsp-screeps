var BCF = require("creep.AI.basefunctions");

var upgradeTransport = function(creep){
    // console.log("creep.room.memory.builderPickup: " + creep.room.memory.builderPickup);
    
    if(Memory.rooms[creep.room.name].upgradeQueue == null){
        Memory.rooms[creep.room.name].upgradeQueue = new Array();
    }

    //check if top of queue is valid creep
    if(Game.getObjectById(Memory.rooms[creep.room.name].upgradeQueue[0]) == null){
        Memory.rooms[creep.room.name].upgradeQueue.shift();
    }

    if(creep.carry.energy !== 0){
        creep.memory.state = "Full";
    }
    else if(creep.carry.energy == 0){
        if(Memory.rooms[creep.room.name].upgradeQueue[0] == creep.id){
            Memory.rooms[creep.room.name].upgradeQueue.shift();
        }
        creep.memory.state = "Empty";        
    }
    

    switch (creep.memory.state) {

        case "Full":
            structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                                filter: function (object) {
                                    return object.energy < object.energyCapacity && object.structureType == STRUCTURE_EXTENSION;
                                }
                            });

            if(structure && !Memory.creepCounts[creep.memory.homeRoom].builder){
                var ret = BCF.action(creep,creep.transfer,[structure,RESOURCE_ENERGY]);
                if(Memory.rooms[creep.room.name].upgradeQueue[0] == creep.id){
                    Memory.rooms[creep.room.name].upgradeQueue.shift();
                }
            }
            else{
                doUpgrade(creep);
            }
            break;
        case "Empty":
            //check for container
            creep.memory.distributing = false;
            var retVal = null;
            
            var storageBig = Game.getObjectById(creep.room.memory.storageBig);
            var storageSmall = Game.getObjectById(creep.room.memory.storageSmall);
            
            if(storageBig){
                if(storageBig.store[RESOURCE_ENERGY] > 0 && !creep.room.memory.builderPickup){
                    retVal = BCF.action(creep,creep.withdraw,[storageBig,RESOURCE_ENERGY]);
                    if(retVal === OK)
                        creep.moveTo(creep.room.controller);
                }
                else
                    BCF.goTo(creep,storageBig.pos,2);
            }
            else if(storageSmall ){
                if(storageSmall.store[RESOURCE_ENERGY] > 0 && !creep.room.memory.builderPickup){
                    retVal = BCF.action(creep,creep.withdraw,[storageSmall,RESOURCE_ENERGY]);
                    if(retVal === OK)
                        creep.moveTo(creep.room.controller);
                }
                else
                    BCF.goTo(creep,storageSmall.pos,2);
            }
            else if(!creep.room.memory.spawning){
                var spawn = Game.getObjectById(creep.memory.spawnID);

                if(spawn.energy > 0){
                    retVal = BCF.action(creep,creep.withdraw,[spawn,RESOURCE_ENERGY]);
                    if(retVal === OK)
                        creep.moveTo(creep.room.controller,{ignoreCreeps:true});
                }
                else
                    BCF.goTo(creep,spawn.pos,2);
            }
            break;
        //upgraderAI(creep);
        default:
            break;

    }


}


function doUpgrade(creep){
    if(!creep.memory.distributing){
        creep.memory.distributing = false;
    }
    var container = Game.getObjectById(creep.room.memory.container);

    var destination = container || creep.room.controller;
    
    if(BCF.goTo(creep,destination.pos,5) == false || creep.memory.distributing){

        creep.memory.distributing = true;

        if(container){
            if(BCF.action(creep,creep.transfer, [container,RESOURCE_ENERGY]) == OK){
                creep.memory.state = "Empty";

                var storageBig = Game.getObjectById(creep.room.memory.storageBig);
                var storageSmall = Game.getObjectById(creep.room.memory.storageSmall);
                var spawn = Game.getObjectById(creep.memory.spawnID);

                creep.moveTo(storageBig || storageSmall || spawn);
            }
        }
        else{
            checkQueue(creep);
        }
    }
    
}

function checkQueue(creep){
    if(Game.getObjectById(creep.memory.destID) == null){
        
        var upgraders = _.filter(creep.room.find(FIND_MY_CREEPS),(creep2) => creep2.memory.spawnID == creep.memory.spawnID && creep2.memory.creepType == 'upgrader' && Math.abs(creep2.pos.x - creep2.room.controller.pos.x) < 5 && Math.abs(creep2.pos.y - creep2.room.controller.pos.y) < 5).sort(compare);

        if(upgraders.length > 0)
            creep.memory.destID = upgraders[0].id;
    }

    if(Memory.rooms[creep.room.name].upgradeQueue[0] == creep.id){
        resVal = BCF.action(creep,creep.transfer,[Game.getObjectById(creep.memory.destID),RESOURCE_ENERGY]);
        if(resVal == OK || resVal == ERR_FULL){
            creep.memory.destID = null;
        }
    }
    else if(Memory.rooms[creep.room.name].upgradeQueue.length === 0){
        resVal = BCF.action(creep,creep.transfer,[Game.getObjectById(creep.memory.destID),RESOURCE_ENERGY]);
        if(resVal == OK || resVal == ERR_FULL){
            var upgraders = _.filter(creep.room.find(FIND_MY_CREEPS),(creep2) => creep2.memory.spawnID == creep.memory.spawnID && creep2.memory.creepType == 'upgrader' && Math.abs(creep2.pos.x - creep2.room.controller.pos.x) < 5 && Math.abs(creep2.pos.y - creep2.room.controller.pos.y) < 5).sort(compare);
            creep.memory.destID = upgraders[0].id;;
            creep.moveTo(upgraders[0]);
        }
        Memory.rooms[creep.room.name].upgradeQueue.push(creep.id);
    }
    else if(Memory.rooms[creep.room.name].upgradeQueue.includes(creep.id)){
        // creep.moveTo(Game.getObjectById(creep.memory.destID));
    }
    else{
        Memory.rooms[creep.room.name].upgradeQueue.push(creep.id);

    }

}

function compare(a,b) {
  if (a.carry.energy < b.carry.energy)
    return -1;
  if (a.carry.energy > b.carry.energy)
    return 1;
  return 0;
}

module.exports = upgradeTransport;