var basefunctions ={
    action:function(creep,action,argsArray,moveArgs = null){
        retVal = action.apply(creep,argsArray);
        if(retVal == ERR_NOT_IN_RANGE){
            //Assume target is always first param.  Hopfully this is always true
            creep.moveTo(argsArray[0],moveArgs);
        }
        return retVal;
    },
    goTo:function(creep,targetPos,distance){
        if(creep.room.name !== targetPos.roomName){
            creep.moveTo(targetPos);
            return true;
        }
        else if(Math.abs(targetPos.x - creep.pos.x) > distance || Math.abs(targetPos.y - creep.pos.y) > distance ){
            creep.moveTo(targetPos.x,targetPos.y);
            return true;
        }
        else{
            return false;
        }
    }
}

module.exports = basefunctions;