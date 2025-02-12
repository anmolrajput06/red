var Sys = require('../../../Boot/Sys');
var moment = require('moment');

module.exports = { 
    
    checkForToday: async function(data){
        try{
             var date = moment().format('YYYY MM DD');
             var loginLogs = await Sys.Game.Common.Services.LoginLogServices.getByData({ id : data , date : date });
             if(loginLogs.length){
              console.log("in length");
               return true;
            }
            else{
              console.log("not in length", loginLogs);
               return false;
            }
        }catch (error){
            Sys.Log.info('Error in checkForToday : ' + error);
            return new Error('Error in checkForToday');
        }
      
    },

    creatLoginLog: async function(player, date , ip, data){
        try{
            player.fcm_token = data.fcm_token;
            player.device_name = data.device_name;
            player.device_os = data.device_os;

            await Sys.Game.Common.Services.PlayerServices.update(
                {
                  _id : player.id
                },
                {
                  fcm_token: data.fcm_token,
                  device_name: data.device_name,
                  device_os: data.device_os
            });
            let plr = await Sys.Game.Common.Services.PlayerServices.getOneByData({_id : player.id });

            if (!plr) {
                return {
                    status: 'fail',
                    result: null,
                    message: "plr Not Found",
                    statusCode: 401
                };
            }
            else{
                if(plr){
                    let loginLogs = await Sys.Game.Common.Services.LoginLogServices.create({
                        player: player.id,
                        flag: data.flag,
                        client: data.client,
                        ip: ip,
                        date: date
                    });
                    if(!loginLogs){
                       return {
                           status : 'fail',
                           result : null,
                           message : 'Some thing is wrong. Save log'
                       }
                    }
                    return plr;
                }else{
                    return player;
                }
                
            }

        }catch (error){
            Sys.Log.info('Error in creatLoginLog : ' + error);
            return new Error('Error in creatLoginLog');
        }
    },

    checkForYestarday: async function(id){
        try{
            var date = moment().subtract(1, 'days').format('YYYY MM DD');
            var loginLogs = await Sys.Game.Common.Services.LoginLogServices.getByData({ id : id , date : date });
                if(!loginLogs){
                     return {
                      status : 'fail',
                      result : null,
                      message : 'Something is wrong. Find Player first'
                    }
                }

                if(loginLogs.length){
                     return true;
                }else{
                     return false;
                }
        }catch (error){
            Sys.Log.info('Error in checkForYestarday : ' + error);
            return new Error('Error in checkForYestarday');
        }
    },

}