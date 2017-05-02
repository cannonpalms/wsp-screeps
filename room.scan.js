var roomScanner = {

    scanRoom: function(room){


        //MAP SPANWS
        if(!room.memory.spawns || room.memory.spawns.length === 0){
            room.memory.spawns = _.map(room.find(FIND_MY_SPAWNS),spawn => spawn.id);
        }

        for (var index in room.memory.spawns) {
            if(!Game.getObjectById(room.memory.spawns[index])){
                room.memory.spawns = _.map(room.find(FIND_MY_SPAWNS),spawn => spawn.id);
            }
            
        }

        if(!Game.getObjectById(room.memory.mainSpawn)){
            room.memory.mainSpawn = room.memory.spawns[0];
        }

        var mainSpawn = Game.getObjectById(room.memory.mainSpawn);
        var spawns = _.map(room.memory.spawns,(spawnID) => Game.getObjectById(spawnID));


        //MAP SOURCES
            //containers
            //distance
        var sources = room.find(FIND_SOURCES);
        
        for(var sourceNum in sources){
            
            x = sources[sourceNum].pos.x;
            y = sources[sourceNum].pos.y;
            sPos = sources[sourceNum].pos;

            if(room.memory.sources == null)
                room.memory.sources = {};

            if(room.memory.sources[sources[sourceNum].id] == null)
                room.memory.sources[sources[sourceNum].id] = {};

            //check for containers near sources, control, and spawn
            //sources
            var container = Game.getObjectById(room.memory.sources[sources[sourceNum].id].container);

            if(!container){
                var sourceContainer = sources[sourceNum].pos.findInRange(FIND_STRUCTURES,1,{
                                filter: function (object) {
                                    return object.structureType == STRUCTURE_CONTAINER;
                                }
                            });
                if(sourceContainer.length !== 0){
                    room.memory.sources[sources[sourceNum].id].container = sourceContainer[0].id;
                }
            }

            if(1===1){

                if(spawns.length > 0 && !room.memory.sources[sources[sourceNum].id].dSpawn){
                    room.memory.sources[sources[sourceNum].id].dSpawn = sPos.findPathTo(spawns[0],{ignoreCreeps:true}).length;
                }
                if(!room.memory.sources[sources[sourceNum].id].dControl){
                    room.memory.sources[sources[sourceNum].id].dControl = sPos.findPathTo(sources[sourceNum].room.controller,{ignoreCreeps:true}).length;
                }
            }
        }

        if(1===1){
            if(spawns.length > 0 && !room.memory.dControl){
                room.memory.dControl = spawns[0].pos.findPathTo(room.controller,{ignoreCreeps:true}).length;
            }
        }

        //controller
        // room.memory.container = null;
        container = Game.getObjectById(room.memory.container);

        if(!container && room.controller){
            var controlContainer = room.controller.pos.findInRange(FIND_STRUCTURES,3,{
                            filter: function (object) {
                                return object.structureType == STRUCTURE_CONTAINER;
                            }
                        });

            if(controlContainer.length !== 0){
                room.memory.container = controlContainer[0].id;
            }
        }

        if(spawns.length > 0){
            //Spawn - Storage
            container = Game.getObjectById(room.memory.storageBig);
            if(!container){
                var controlStorage = spawns[0].pos.findInRange(FIND_STRUCTURES,1,{
                                    filter: function (object) {
                                        return object.structureType == STRUCTURE_STORAGE;
                                    }
                                });
                if(controlStorage.length !== 0){
                    room.memory.storageBig = controlStorage[0].id;
                }
            }

        
            //Spawn - Container
            container = Game.getObjectById(room.memory.storageSmall);
            if(!container){
                var controlStorage = spawns[0].pos.findInRange(FIND_STRUCTURES,1,{
                                    filter: function (object) {
                                        return object.structureType == STRUCTURE_CONTAINER;
                                    }
                                });
                if(controlStorage.length !== 0){
                    room.memory.storageSmall = controlStorage[0].id;
                }
            }
        }

        if(!room.memory.childRooms){
            room.memory.childRooms = _.map(Game.map.describeExits(room.name));
        }

        //Find center of room
        if(room.name == 'W6N8' && 1===2){
            var x = 0
            var y = 0
            var count = 0;


            for(var sourceNum in sources){
            
                x += sources[sourceNum].pos.x;
                y += sources[sourceNum].pos.y;
                count++;
            }

            x += room.controller.pos.x;
            y += room.controller.pos.y;
            count++

            console.log("X: " + Math.floor(x/count));            
            console.log("Y: " + Math.floor(y/count));            

            
            //add source positions
            //add controller postion

            //divide
            //output the pos
        }

        if(Memory.creepCounts && Memory.creepCounts[room.name] && Memory.creepCounts[room.name].reserver)
            room.memory.reserverTimer = 0;
        else
            room.memory.reserverTimer++;


        //Foreach source
            //Determine distances from control in room to each source (number of transporters)??
            //distance from spawnCluster

        //Detect other players?

        //Exit directions?

        //Other stuff.  Who knows.
    },
    scanChild: function(room,parent){

        //find sources and distances
        //find control and distance
            //determine if cost effective to reserve.  Flag accordingly
            


    }

}

module.exports = roomScanner;