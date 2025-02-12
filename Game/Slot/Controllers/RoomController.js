 var Sys = require('../../../Boot/Sys');

module.exports = { 
    
    test: async function(socket,data){
    
        try {
 
            // Create new Room 
            Sys.Log.info('data : ', data); 

            Sys.Log.info('<=> Create New Room || ');
                
            let room = await Sys.Game.Common.Services.RoomServices.create(data);
            if (!room) {
                return { status: 'fail', result: null, message: 'No Room Created 1.', statusCode: 401 }
            }
            
            room = await Sys.Game.Common.Services.RoomServices.get(room.id); //// Just Get Table Data With Format.
            console.log("room Before :",room.players)
            room.AddPlayer();
            console.log("room After :",room)    

            return room;
           
        } catch (error) {
            Sys.Log.info('Error in Test : ' + error);
        }

    },

}