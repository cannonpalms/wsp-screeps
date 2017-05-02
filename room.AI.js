var spawnAI = require("spawn.AI");

var roomAI = {
    //Decides what to build in a room

    run: function(room){
        var creepCounts = {};
        var creeps = room.find(FIND_MY_CREEPS);
        var buildCreepType = null;
        var buildCreepMemory = null;
        

        spawns = _.map(room.memory.spawns,(spawnID) => Game.getObjectById(spawnID))
                    .filter((spawn) => !spawn.spawning);
                    
        
        if(spawns.length > 0){
            room.memory.spawning = false;

            if(room.memory.upgradeQueue == null){
                room.memory.upgradeQueue = new Array();
            }

            if(Memory.creepCounts[room.name])
                creepCounts = Memory.creepCounts[room.name];
            else
                creepCounts = {};

            room.memory.buildSites = _.sortBy(room.find(FIND_MY_CONSTRUCTION_SITES),'progress');

            //eventually append to spawn queue
            //decide which creep to build for now
            var creepToBuildReturn = creepToBuild(room,creeps,creepCounts);

            if(!creepCounts.transport || !creepCounts.harvester)
                baseOnly = true;
            else
                baseOnly = false; //for now

            // if(room.name == 'W6N8')
            //     baseOnly = true;

            // if(room.name == 'W7N4')
            //     baseOnly = true;
            

            if(creepToBuildReturn != null){
                buildCreeptype = creepToBuildReturn[0];
                buildCreepMemory = creepToBuildReturn[1];

                for(var index in spawns){
                    spawnAI.trySpawn(spawns[index],creepType,memoryVars,baseOnly);
                }
            } 
        }
    }
}

function creepToBuild(room,creeps,creepCounts ){
    //eventually will add to build queue
    //returns a creepType and memory to build from a spawn

    var functRetVal = baseEco(room,creeps,creepCounts);

    if(!functRetVal){
        if(room.memory.buildSites.length > 0){
            functRetVal = buildingState(room,creeps,creepCounts);
        }
        else if(1===2 && room.name === 'W3N4'){
            functRetVal = secureOurFuture(room,creeps,creepCounts);
        }
        else{
            functRetVal = upgradingState(room,creeps,creepCounts);
        }
    }

    if(!functRetVal){
        functRetVal = buildDistanceMiners(room,creeps,creepCounts);
    }

    if(!functRetVal && 1===2 && room.name === 'W3N4'){
        functRetVal = secureOurFuture(room,creeps,creepCounts);
    }

    return functRetVal;
}

function baseEco(room,creeps,creepCounts){
    //bare bones
    //1 harvestor and transport per source
    var buildCreeptype;
    var buildCreepMemory;
    var retVal;
    // var spawnID = room.find(FIND_MY_SPAWNS)[0].id;
    var spawnID = room.memory.mainSpawn;

    

    for(source in room.memory.sources){

        //1 harvestor and transport for each source
        hCount = _.filter(creeps,(creep) => creep.memory.resource == source && 
                                            creep.memory.creepType == 'harvester' &&
                                            (creep.spawning || ((creep.ticksToLive||1500) - creep.memory.travelTicks > 0))).length;

        tCount = _.filter(creeps,(creep) => creep.memory.resource == source && creep.memory.creepType == 'transport' && creep.memory.transportType == 'spawn').length;
        
        if(hCount < 1){
            creepType = 'harvester';
            memoryVars = {state:'Empty'
                            ,resource:source
                            ,creepType:'harvester'
                            ,travelTicks:0
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];
        }

        else if(tCount < 1){
            creepType = 'transport';
            memoryVars = {state:'Empty'
                            ,resource:source
                            ,creepType:'transport'
                            ,transportType:'spawn'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];
        }
    }

    // var spawnID = room.find(FIND_MY_SPAWNS)[0].id;
    var spawnID = room.memory.mainSpawn;

    var bCount = creepCounts.builder;

    if(bCount == null || bCount < 1){
        creepType = 'builder';
        memoryVars = {state:'Empty'
                        ,resource:null
                        ,creepType:'builder'
                        ,transportType:'spawn'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                  

    }

    for(source in room.memory.sources){

        //1 harvestor and transport for each source
        tCount = _.filter(creeps,(creep) => creep.memory.resource == source && creep.memory.creepType == 'transport' && creep.memory.transportType == 'spawn').length;

        var dSpawn = room.memory.sources[source].dSpawn;
        transportSize = room.memory.creepSize.transport.carry*50;
        harvesterSize = room.memory.creepSize.harvester.work*4;
        var expectedTCount = Math.ceil((harvesterSize*(dSpawn-3)/transportSize));

        if(tCount < expectedTCount){
            creepType = 'transport';
            memoryVars = {state:'Empty'
                            ,resource:source
                            ,creepType:'transport'
                            ,transportType:'spawn'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];
        }
    }

    var upgraders = creepCounts.upgrader;

    if(upgraders == null || upgraders < 1){
        creepType = 'upgrader';
        memoryVars = {state:'Empty'
                        ,resource:null
                        ,creepType:'upgrader'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                        
    }

    tCount = creepCounts.upgradeTransport;


    if(!tCount || tCount < 1){
            creepType = 'upgradeTransport';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'upgradeTransport'
                            ,transportType:'upgrade'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];
        }

    var thieves = creepCounts.thief;
    if((!thieves || thieves < 5) && room.name === 'W1N4' && 1===2){
        creepType = 'thief';
        memoryVars = {state:'Empty'
                        ,resource:null
                        ,creepType:'thief'
                        ,transportType:'upgrade'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        // return [creepType,memoryVars];
    }

    return null;
}

function buildingState(room,creeps,creepCounts){
    // var spawnID = room.find(FIND_MY_SPAWNS)[0].id;
    var spawnID = room.memory.mainSpawn;
    var sourceID = room.find(FIND_SOURCES)[0].id;    

    var builders = creepCounts.builder;
    //transports for between source and controller
    //builders
    if(builders == null || builders < 3){
        creepType = 'builder';
        memoryVars = {state:'Empty'
                        ,resource:sourceID
                        ,creepType:'builder'
                        ,transportType:'spawn'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                        
    }

    var upgraders = creepCounts.upgrader;

    if(upgraders == null || upgraders < 1){
        creepType = 'upgrader';
        memoryVars = {state:'Empty'
                        ,resource:sourceID
                        ,creepType:'upgrader'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                        
    }

    tCount = _.filter(creeps,(creep) => creep.memory.creepType == 'upgradeTransport').length;

    if(tCount < 1){
            creepType = 'upgradeTransport';
            memoryVars = {state:'Empty'
                            ,resource:source
                            ,creepType:'upgradeTransport'
                            ,transportType:'upgrade'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];
        }

    return null;
}

function upgradingState(room,creeps,creepCounts){
    //transports for between controller and cources
    // var spawnID = room.find(FIND_MY_SPAWNS)[0].id;
    var spawnID = room.memory.mainSpawn;
    var sourceID = room.find(FIND_SOURCES)[0].id;

    //upgraders
    var upgraders = creepCounts.upgrader;
    var builders = creepCounts.builder;
    // room.memory.creepCounts
    //console.log(JSON.stringify(room.memory.creepCounts));

    if(upgraders == null || upgraders < 1){
        creepType = 'upgrader';
        memoryVars = {state:'Empty'
                        ,resource:sourceID
                        ,creepType:'upgrader'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                        
    }

    tCount = _.filter(creeps,(creep) => creep.memory.creepType == 'upgradeTransport').length;
    sourceCount = Object.keys(room.memory.sources).length;

    // if(Object.keys(room.memory.externalSources).length > 0 && ){
    if(room.name === 'W3N4'){
        // sourceCount++;
    }

    var dControl = room.memory.dControl;
    var upgradeTransportSize = room.memory.creepSize.upgradeTransport.carry*50;
    var harvesterSize = room.memory.creepSize.harvester.work;
    var upgraderSize = room.memory.creepSize.upgrader.work;

    var expectedTCount = Math.ceil((4*harvesterSize*sourceCount*(dControl-2)/upgradeTransportSize));

    if(tCount < expectedTCount){
            creepType = 'upgradeTransport';
            memoryVars = {state:'Empty'
                            ,resource:source
                            ,creepType:'upgradeTransport'
                            ,transportType:'upgrade'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];
        }


    var expectedUCount = Math.floor(harvesterSize*sourceCount*2/upgraderSize);

    var storageBig = Game.getObjectById(room.memory.storageBig);
    var storageSmall = Game.getObjectById(room.memory.storageSmall);

    if(storageBig && storageBig.store[RESOURCE_ENERGY] > 70000){
        // expectedUCount++;
    }

    else if(storageSmall && storageSmall.store[RESOURCE_ENERGY] > 1000){
        // expectedUCount++;
    }

    if(upgraders < expectedUCount){
        creepType = 'upgrader';
        memoryVars = {state:'Empty'
                        ,resource:sourceID
                        ,creepType:'upgrader'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                        
    }

    if(builders == null || builders < 1){
        creepType = 'builder';
        memoryVars = {state:'Empty'
                        ,resource:sourceID
                        ,creepType:'builder'
                        ,transportType:'spawn'
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        return [creepType,memoryVars];                        
    }

        // creepType = 'test';
        // memoryVars = {state:'Empty'
        //                 ,resource:sourceID
        //                 ,creepType:'humanControl'
        //                 ,spawnID:spawnID};

        // return [creepType,memoryVars];  

    //Check if exploring needs to happen

    return null;

}

function buildDistanceMiners(room,creeps,creepCounts){
    //check if neighbor rooms are explored and build explorer
    var spawnID = room.memory.mainSpawn;

    if(room.memory.creepSize.remoteTransport)
        var remoteTransportSize = room.memory.creepSize.remoteTransport.carry*50;
    else
        var remoteTransportSize = 250;

    if(!creepCounts.explorer && room.name == 'W4N4'){
        creepType = 'explorer';
        memoryVars = {state:'Empty'
                        ,creepType:'explorer'
                        ,travelTicks:0
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        // return [creepType,memoryVars];

    }

    if(!creepCounts.scavenger && room.name == 'W3N4'){
        creepType = 'scavenger';
        memoryVars = {state:'Empty'
                        ,creepType:'scavenger'
                        ,travelTicks:0
                        ,spawnID:spawnID
                        ,homeRoom:room.name};

        // return [creepType,memoryVars];
    }

    for(roomName in room.memory.externalSources){
        if(Memory.invaderTime)
            continue;

        //Defender
         if(!creepCounts.defender){
            creepType = 'defender';
                memoryVars = {state:'Empty'
                                ,creepType:'defender'
                                ,travelTicks:0
                                ,spawnID:spawnID
                                ,defendRoom:roomName
                                ,homeRoom:room.name};

                // return [creepType,memoryVars];
        }

        //Reserver
        if(!creepCounts.reserver && room.energyCapacityAvailable >= 1300 && room.memory.reserverTimer > 200){
            creepType = 'reserver';
                memoryVars = {state:'Empty'
                                ,creepType:'reserver'
                                ,travelTicks:0
                                ,spawnID:spawnID
                                ,claimRoom:roomName
                                ,homeRoom:room.name};

                // return [creepType,memoryVars];
        }

        for(source in room.memory.externalSources[roomName]){
            // rhCount = 

            if(!creepCounts.remoteHarvester || !creepCounts.remoteHarvester[source]){
                creepType = 'remoteHarvester';
                memoryVars = {state:'Empty'
                                ,resource:source
                                ,resourcePos:room.memory.externalSources[roomName][source]
                                ,creepType:'remoteHarvester'
                                ,travelTicks:0
                                ,spawnID:spawnID
                                ,homeRoom:room.name};

                return [creepType,memoryVars];
            }

            var distance = room.memory.externalSources[roomName][source].distance;
            
            if(Game.rooms[roomName] && Game.rooms[roomName].controller && Game.rooms[roomName].controller.reservation){
                var reserveMulti = 2;
            }
            else{
                var reserveMulti = 1;                
            }
            var expectedRTCount = Math.ceil((9*reserveMulti*(distance)/remoteTransportSize));  

            if(!creepCounts.remoteTransport || !creepCounts.remoteTransport[source] || creepCounts.remoteTransport[source] < expectedRTCount){
                creepType = 'remoteTransport';
                memoryVars = {state:'Empty'
                                ,resource:source
                                ,resourcePos:room.memory.externalSources[roomName][source]
                                ,creepType:'remoteTransport'
                                ,transportType:'spawn'
                                ,spawnID:spawnID
                                ,homeRoom:room.name};

                return [creepType,memoryVars];
            }

        }

    }
    return null;
}

function secureOurFuture(room,creeps,creepCounts){

    // var spawnID = room.find(FIND_MY_SPAWNS)[0].id;
    var spawnID = room.memory.mainSpawn;

    var active =  true

    if(active){

        allCreeps = _.map(Game.creeps)
                    .filter((creep) => creep.spawning || ((creep.ticksToLive||1500) - creep.memory.travelTicks > 0));

        var cCount = _.filter(allCreeps,(creep) => creep.memory.creepType == 'claimer').length;
        var ccCount = _.filter(allCreeps,(creep) => creep.memory.creepType == 'controlClaimer').length;
        var hCount = _.filter(allCreeps,(creep) => creep.memory.creepType == 'humanControl').length;
        var h2Count = _.filter(allCreeps,(creep) => creep.memory.creepType == 'humanControl2').length;
        var h3Count = _.filter(allCreeps,(creep) => creep.memory.creepType == 'humanControl3').length;
        var dCount = _.filter(allCreeps,(creep) => creep.memory.creepType == 'drainer').length;

        if(dCount < 0){

            creepType = 'drainer';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'drainer'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];  

        }
        
        if(h3Count < 0){

            creepType = 'humanControl3';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'humanControl3'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];  

        }

         if(hCount < 1){

            creepType = 'humanControl';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'humanControl'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];  

        }

        if(h2Count < 0){

            creepType = 'humanControl2';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'humanControl2'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];  

        }

        if(ccCount < 0){

            creepType = 'controlClaimer';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'controlClaimer'
                            ,hasClaim: true
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];  

        }

        if(cCount < 0){

            creepType = 'claimer';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'claimer'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];  

        }

        var upgraders = creepCounts.upgrader;

        if(upgraders == null || upgraders < 2){
            creepType = 'upgrader';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'upgrader'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];                        
        }

        var upgradeTransports = creepCounts.upgradeTransport;
        var dControl = room.memory.dControl;
        var expectedTCount = Math.ceil((40*(dControl-3)/250)); 

        if(upgraders == null || upgradeTransports < expectedTCount){
            creepType = 'upgradeTransport';
            memoryVars = {state:'Empty'
                            ,resource:null
                            ,creepType:'upgradeTransport'
                            ,spawnID:spawnID
                            ,homeRoom:room.name};

            return [creepType,memoryVars];                        
        }
    }


    return null;
}


module.exports = roomAI