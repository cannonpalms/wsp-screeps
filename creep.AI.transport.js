var BCF = require("creep.AI.basefunctions");

var transport = function(creep){
    
    //check if top of queue is valid creep
    if(Memory.rooms[creep.room.name].upgradeQueue && !Game.getObjectById(Memory.rooms[creep.room.name].upgradeQueue[0])){
        Memory.rooms[creep.room.name].upgradeQueue.shift();
    }
        
    switch (creep.memory.state){
        case "Empty":

            if(Game.getObjectById(creep.memory.resource)){
                var target = Game.getObjectById(creep.memory.resource).pos;
            }
            else{
                var target = new RoomPosition(creep.memory.resourcePos.x,creep.memory.resourcePos.y,creep.memory.resourcePos.room);
            }

            if(target.roomName !== creep.room.name){
                creep.moveTo(target);
                return;
            }

            if(BCF.goTo(creep,target,5) === true){
                return;
            }

            
           
            var fromCreepGroup = _.filter(creep.room.lookForAtArea(LOOK_CREEPS,target.y-1,target.x-1,target.y+1,target.x+1,true),(x) => x.creep.my == true && (x.creep.memory.creepType == 'harvester' || x.creep.memory.creepType == 'remoteHarvester'));

            if(fromCreepGroup.length == 0){
                return;
            }

            for(index in fromCreepGroup){
                fromCreep = fromCreepGroup[index].creep;
                var ret = getEnergy(creep,fromCreep);
                if(ret === ERR_NOT_IN_RANGE){
                    creep.moveTo(fromCreep);
                    break;
                }
                else if(ret === OK){
                    creep.moveTo(Game.getObjectById(creep.memory.spawnID));
                    break;
                }
            }

            break;
        case "Full":
            var spawn = Game.getObjectById(creep.memory.spawnID);
            var storageBig = Game.getObjectById(creep.room.memory.storageBig);
            var storageSmall = Game.getObjectById(creep.room.memory.storageSmall);
            var mainStore = storageBig || storageSmall;
            var retVal = null;

            if(Memory.creepCounts && Memory.creepCounts[creep.memory.homeRoom] && !Memory.creepCounts[creep.memory.homeRoom].builder){
                var extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                                    filter: function (object) {
                                        return object.energy < object.energyCapacity && (object.structureType == STRUCTURE_EXTENSION);
                                    }
                                });

                
                if(extension){
                    retVal = BCF.action(creep,creep.transfer,[extension,RESOURCE_ENERGY]);
                }
            }


            else if(spawn.energy < spawn.energyCapacity){
                retVal = BCF.action(creep,creep.transfer,[spawn,RESOURCE_ENERGY]);
            }
            else if(mainStore){
                if(_.sum(mainStore.store) < mainStore.storeCapacity)
                    retVal = BCF.action(creep,creep.transfer,[mainStore,RESOURCE_ENERGY]);
                else    
                    retVal = BCF.goTo(creep,mainStore.pos,4);
            }

            if(retVal === null){
                structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: function (object) {
                                return object.energy < object.energyCapacity;
                            }
                        });

                if(structure){
                    retVal = BCF.action(creep,creep.transfer,[structure,RESOURCE_ENERGY]);
                }
                else{
                    BCF.goTo(creep,Game.getObjectById(creep.memory.spawnID).pos,2);
                }
            }

            if(retVal === OK){
                var target = null;
                var source = Game.getObjectById(creep.memory.resource);

                if(source){
                    target = source;
                }
                else{
                    target = new RoomPosition(creep.memory.resourcePos.x,creep.memory.resourcePos.y,creep.memory.resourcePos.room);
                }

                creep.moveTo(target);
            }
            
            //Dump at destination
            //Travel to destination
            //Update state
            break;
    }
}

function getEnergy(toCreep,fromCreep){
    //Check how much toCreep has
    var AP = fromCreep.carry.energy;
    var AR = toCreep.carryCapacity - toCreep.carry.energy;

    var transVal;
    var retVal = null;

    toCreep.memory.state = "Full";

    if(AP > AR)
        transVal = AR;
    else
        transVal = AP;

    //check fromcreeps square and pickup energy if there
    var droppedEnergy = fromCreep.pos.lookFor(LOOK_ENERGY);
    

    if(droppedEnergy.length !== 0){
        retVal = toCreep.pickup(droppedEnergy[0]);
    }

    var sourceContainer = _.filter(fromCreep.pos.lookFor(LOOK_STRUCTURES),(object)=> object.structureType == STRUCTURE_CONTAINER 
    //&& object.store[RESOURCE_ENERGY] > 0
    );
    
    if(sourceContainer.length !== 0){
        toCreep.memory.state = "Full";
        retVal = toCreep.withdraw(sourceContainer[0],RESOURCE_ENERGY);
    }

    var retVal2 = fromCreep.transfer(toCreep,RESOURCE_ENERGY);

    if(retVal === null)
        retVal = retVal2;
        
    return retVal;
    //Check how much fromCreep can take

    //sechedule action
    //return err code
}

module.exports = transport;