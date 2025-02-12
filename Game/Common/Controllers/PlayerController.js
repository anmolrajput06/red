var Sys = require('../../../Boot/Sys');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

module.exports = {
    register: async function (data, socket) {
        try {
            data = JSON.parse(data)
            const uniqueData = await checkUniqueData(data);
            if(uniqueData.code == 1){
                let params = {
                    socialId: null,
                    loginType : "S",
                    name: data.name,
                    email: data.email,
                    password: bcrypt.hashSync(data.password, 10),
                    balance:0,
                    deviceType: data.deviceType,
                    deviceToken: data.deviceToken,
                }
                let isRegistered = await Sys.Game.Common.Services.PlayerServices.create(params);
                
                let player = await Sys.Game.Common.Services.PlayerServices.findOneUser({_id: mongoose.Types.ObjectId(isRegistered.id)});
                let token = jwt.sign({id:player._id},Sys.Config.Database.JWT_KEY);
                await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: player._id },{authToken:token});
                player.token = token;
                if(isRegistered){
                    return {
                        statusCode: 1,
                        message: "Player registered successfully",
                        result: player
                    }
                }else{
                    return {
                        statusCode: 0,
                        message: "Failed to register",
                        result: null
                    }
                }
            }else{
                return {
                    statusCode: 0,
                    message: uniqueData.message,
                    result: null
                }
            }
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->register", e);
        }
    },
    login: async function (data, socket) {
        try {
            data = JSON.parse(data);
            let player = {};
            if(data.loginType=="S"){
                if( data.email==undefined ||data.email=="" || data.password==undefined || data.password==""){
                    return {
                        statusCode: 0,
                        message: "Please provide proper email and password",
                        result: null
                    }
                }
                player = await Sys.Game.Common.Services.PlayerServices.findOneUser({ email: data.email });
                if(player){
                    if(bcrypt.compareSync(data.password, player.password)){
                        let token = jwt.sign({id:player._id},Sys.Config.Database.JWT_KEY);
                        let params = {
                            deviceType: data.deviceType,
                            deviceToken: data.deviceToken,
                            authToken: token,
                            login:true,
                        }
                        await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: player._id },params);
                        player.deviceType= data.deviceType
                        player.deviceToken= data.deviceToken
                        player.authToken = token;
                        
                    }else{
                        return {
                            statusCode: 0,
                            message: "Please provide proper email and password",
                            result: null
                        }
                    }
                }else{
                    return {
                        statusCode: 0,
                        message: "Please provide proper email and password",
                        result: null
                    }
                }
            }else{
                if( data.socialId==undefined ||data.socialId=="" || data.name==undefined || data.name==""){
                    return {
                        statusCode: 0,
                        message: "Please provide proper socialId and name",
                        result: null
                    }
                }
                let player = await Sys.Game.Common.Services.PlayerServices.findOneUser({ socialId: data.socialId });
                if(player){
                    let token = jwt.sign({id:player._id},Sys.Config.Database.JWT_KEY);
                    let params = {
                        deviceType: data.deviceType,
                        deviceToken: data.deviceToken,
                        authToken:token,
                        login:true,
                    }

                    await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: player._id },params);
                    player.deviceType= data.deviceType
                    player.deviceToken= data.deviceToken
                    player.authToken = token;
                    
                    
                }else{
                    let params = {
                        socialId: data.socialId,
                        loginType : data.loginType,
                        name: data.name,
                        email:"",
                        password: "",
                        balance:0,
                        deviceType: data.deviceType,
                        deviceToken: data.deviceToken,
                    }
                    let isRegistered = await Sys.Game.Common.Services.PlayerServices.create(params);
                    player = await Sys.Game.Common.Services.PlayerServices.findOneUser({_id: mongoose.Types.ObjectId(isRegistered.id)});
                    let token = jwt.sign({id:player._id},Sys.Config.Database.JWT_KEY);
                    await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: player._id },{authToken:token,login:true});
                    if(isRegistered){
                        return {
                            statusCode: 1,
                            message: "Player registered successfully",
                            result: player
                        }
                    }else{
                        return {
                            statusCode: 0,
                            message: "Failed to register",
                            result: null
                        }
                    }
                }
            }
            let game = [];
            let favouriteGameList ={};
            game = await Sys.Game.Common.Services.GameService.findGame();
            game = JSON.parse(JSON.stringify(game));
            if(player.favouriteGameList){
                favouriteGameList = player.favouriteGameList;
            }

            for (let i = 0; i < game.length; i++) {
                console.log(favouriteGameList[game[i]._id],game[i].id);
                if(favouriteGameList[game[i].id]!=undefined && favouriteGameList[game[i].id]==true){
                    game[i].isFavourite = true;
                }else{
                    game[i].isFavourite = false;
                }
            }
            player.gameList = game;
            return {
                statusCode: 1,
                message: "Login Successfully",
                result: player
            }
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->pinAuth", e);
        }
    },
    logout: async function (data, socket) {
        try {
            data = JSON.parse(data);
            let isUpdated = await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id : mongoose.Types.ObjectId(data.playerId) },{
                login : false,
                authToken: ""
            });


            if(isUpdated){
                return {
                    statusCode: 1,
                    message: "Login successfully",
                    result: null
                }
            }else{
                return {
                    statusCode: 0,
                    message: "Something went wrong",
                    result: null
                }
            }
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->pinAuth", e);
        }
    },
    editProfile: async function (data, socket){
        try {
            data = JSON.parse(data);
            const uniqueData = await checkUniqueData(data);
            if(uniqueData.code ==1){
                let params = {
                    name: data.name,
                    email: data.email
                }
                if(data.password != undefined && data.password != ""){
                    params.password = bcrypt.hashSync(data.password, 10);
                }
                let isUpdated = await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: mongoose.Types.ObjectId(data.playerId) },params);
                if(isUpdated){
                    return {
                        statusCode: 1,
                        message: "Successfully updated edit profile",
                        result: null
                    }
                }else{
                    return {
                        statusCode: 0,
                        message: "Something went wrong.",
                        result: null
                    }
                }
            }else{
                return {
                    statusCode: 0,
                    message:uniqueData.message,
                    result: null
                }
            }
            
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->pinAuth", e);
        } 
    },
    addFavouriteGame: async function(data) {
        try{
            data = JSON.parse(data)
            let favouriteGameList = {};
            let player = await Sys.Game.Common.Services.PlayerServices.findOneUserWithFilter({ _id: mongoose.Types.ObjectId(data.playerId)},{favouriteGameList:1});
            if(player){
                if(player.favouriteGameList){
                    favouriteGameList = player.favouriteGameList;
                }
                favouriteGameList[data.gameId] = data.isFavourite
                let isUpdate = await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id :mongoose.Types.ObjectId(data.playerId) },{favouriteGameList:favouriteGameList})
                if(isUpdate){
                    return {
                        statusCode: 1,
                        message: 'Favourite updated successfully',
                        result: null
                    }
                    
                }else{
                    return {
                        statusCode: 0,
                        message: 'Failed to update favourite',
                        result: null
                    }
                }
            }else{
                return {
                    statusCode: 0,
                    message: 'Failed to find player',
                    result: null
                }
            }
        }catch(e){
            console.log("Error",e);
            
        }
        
    },
    getBalance: async function(data,socket) {
        try {
            data = JSON.parse(data)
            let player = await Sys.Game.Common.Services.PlayerServices.findOneUserWithFilter({ _id: mongoose.Types.ObjectId(data.playerId)},{balance:1});
            console.log("player---------->",player);
            if(player){
                playersDetails = {
                    "chips": parseFloat(player.chips)
                }
                return {
                    statusCode: 1,
                    message: 'Successfully fetched balance',
                    result: player.balance
                }
            }else{
                return {
                    statusCode: 0,
                    message: 'Please provide valid playerId',
                    result: null
                }
            }
           
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->pinAuth", e);
            return {
                statusCode: 0,
                message: 'Something went wrong',
                result: null
            }
        }
    },
    updateBalance: async function(data,socket) {
        try {
            data = JSON.parse(data)
            let isUpdate = await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: mongoose.Types.ObjectId(data.playerId)},{$inc:{balance:data.balance}});
            let player = await Sys.Game.Common.Services.PlayerServices.findOneUserWithFilter({ _id: mongoose.Types.ObjectId(data.playerId)},{balance:1});
            if(isUpdate){
                return {
                    statusCode: 1,
                    message: 'Successfully updated balance',
                    result: player.balance
                }
            }else{
                return {
                    statusCode: 0,
                    message: 'Please provide valid playerId',
                    result: null
                }
            }
           
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->pinAuth", e);
            return {
                statusCode: 0,
                message: 'Something went wrong',
                result: null
            }
        }
    },
}

async function checkUniqueData(data) {
    let playerEmail;
    if(data.playerId!=undefined && data.playerId!=""){
        playerEmail = await Sys.Game.Common.Services.PlayerServices.findOneUser({ email: data.email, _id: { $ne: mongoose.Types.ObjectId(data.playerId) } });
        console.log("asfd",data.playerId,playerEmail);
        if(playerEmail){
            return {code:0,message:"Email is alredy registered"}
        }else{
            return {code:1,message:"Email is available"}
        }
    }else{
        playerEmail = await Sys.Game.Common.Services.PlayerServices.findOneUser({ email: data.email });        
        if(playerEmail){
            return {code:0,message:"Email is alredy registered"}
        }else{
            return {code:1,message:"Email is available"}
        }
    }
}