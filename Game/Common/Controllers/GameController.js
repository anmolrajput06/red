var Sys = require('../../../Boot/Sys');
let redis = require("../../../Config/redis");
const moment = require('moment');
const mongoose = require('mongoose');
const expirationInSeconds = 7200;



module.exports = {
    //For Playing The Game
    spin:async function(data,socket){
        try{
            data = JSON.parse(data);
            console.log("spin",data);
            
            if(data.gameId == "67a1fa900dd03f70eab92f9f"){
                const wild = 0;
                const scatter = 1;
                //Lines for slot
                const lines=[ [1,1,1,1,1], [0,0,0,0,0], [2,2,2,2,2], [0,1,2,1,0], [2,1,0,1,2], [1,0,0,0,1], [1,2,2,2,1], [0,0,1,2,2], [2,2,1,0,0], [1,2,1,0,1], [1,0,1,2,1], [0,1,1,1,0], [2,1,1,1,2], [0,1,0,1,0], [2,1,2,1,2], [1,1,0,1,1], [1,1,2,1,1], [0,0,2,0,0], [2,2,0,2,2], [0,2,2,2,0] ];
                //Payput table: 0=>Wild, 1=>Scatter, 2=>Bus, 3=>Texi, 4=>LondonEye, 5=>A, 6=>k, 7=>Q, 8=>J.
                const payoutTable = {
                    '0': [ 0, 0, 0, 0, 0 ],
                    '1': [ 0, 0, 0, 0, 0 ],
                    '2': [ 0, 0, 25, 75, 250 ],
                    '3': [ 0, 0, 20, 60, 200 ],
                    '4': [ 0, 0, 15, 40, 120 ],
                    '5': [ 0, 0, 2, 4, 12 ],
                    '6': [ 0, 0, 2, 4, 12 ],
                    '7': [ 0, 0, 1, 2, 8 ],
                    '8': [ 0, 0, 1, 2, 8 ]
                };
                const reelStrip = {
                    1:[ 7, 5, 3, 8, 4, 2, 0, 1, 6 ],
                    2:[ 2, 0, 7, 3, 5, 8, 6, 4 ],
                    3:[ 0, 6, 3, 8, 5, 7, 4, 1, 2 ],
                    4:[ 5, 4, 7, 6, 0, 8, 3, 2 ] ,
                    5:[ 3, 7, 4, 0, 8, 5, 2, 1, 6 ]
                };
                const freeSpinReelStrip = {
                    1:[ 7, 5, 3, 8, 4, 2, 0, 6 ],
                    2:[ 2, 0, 7, 3, 5, 8, 6, 4 ],
                    3:[ 0, 6, 3, 8, 5, 7, 4, 2 ],
                    4:[ 5, 4, 7, 6, 0, 8, 3, 2 ],
                    5:[ 3, 7, 4, 0, 8, 5, 2, 6 ]
                };
                const freeSpinCountReelStrip = [ 2, 2, 3, 2, 4, 1, 3, 3, 4, 1, 2, 3, 3, 4, 1 , 5, 1 ];
                const redisUserId = "redBusSlot:"+data.playerId;
                const customer = await Sys.Game.Common.Services.PlayerServices.findOneUserWithFilter({_id: mongoose.Types.ObjectId(data.playerId)},{balance:1}) 
                if(customer){
                    let player = {
                        gameMode: 0,
                        gameWin: 0,
                        freeSpinWin:0,
                        gameStep: 0,
                        freeSpinCount: 0,
                        steckyReel: { 1: [0, 0, 0], 2: [0, 0, 0], 3: [0, 0, 0], 4: [0, 0, 0], 5: [0, 0, 0], },
                    };
                    if(await redis.exists(redisUserId)){
                        player = JSON.parse(await redis.get(redisUserId));
                    }else{
                        redis.set(redisUserId, JSON.stringify(player),'EX',expirationInSeconds);
                    }
                    let isAnticipate = false;
                    let response={};
                    let reels={};
                    let freeSpinCountReels = {};
                    let freeSpinCountReel = [];
                    let bet = 0;
                    let win = 0;
                    let winData = [];
                    let beforBalance = customer.balance;
                    let balance = customer.balance;
                    let currentGameMode = player.gameMode;
                    if(currentGameMode == 0){
                        player.gameWin = 0;
                        player.freeSpinWin = 0;
                        player.gameMode = 0;
                        player.gameStep = 0;
                        player.freeSpinCount = 0;
                        player.steckyReel= { 1: [0, 0, 0], 2: [0, 0, 0], 3: [0, 0, 0], 4: [0, 0, 0], 5: [0, 0, 0], };
                        bet =  data.type;
                        //Ganerate random reel
                        if(balance<bet){
                            //low balance.
                            return {
                                statusCode:1,
                                message:"Low Balance",
                                result:null
                            };
                        }else{
                            balance -= bet;
                            beforBalance = balance;
                            reels = {
                                1: await generateRandomReelRedBus(reelStrip[1]),
                                2: await generateRandomReelRedBus(reelStrip[2]),
                                3: await generateRandomReelRedBus(reelStrip[3]),
                                4: await generateRandomReelRedBus(reelStrip[4]),
                                5: await generateRandomReelRedBus(reelStrip[5]),
                            };
                            // reels={
                            //     1:[4,2,1],
                            //     2:[6,4,2],
                            //     3:[2,1,6],
                            //     4:[7,6,0],
                            //     5:[7,4,1]
                            // }
                            
                            if((reels[1][0]==scatter || reels[1][1]==scatter || reels[1][2]==scatter)  && (reels[3][0]==scatter || reels[3][1]==scatter || reels[3][2]==scatter)){
                                isAnticipate = true;
                            }
    
                            if((reels[1][0]==scatter || reels[1][1]==scatter || reels[1][2]==scatter)  && (reels[3][0]==scatter || reels[3][1]==scatter || reels[3][2]==scatter)  && (reels[5][0]==scatter || reels[5][1]==scatter || reels[5][2]==scatter)){
                                win=bet*5;
                                let freeSpinCount = 0;
                                freeSpinCountReels = await generateRandomReelRedBus(freeSpinCountReelStrip);
                                freeSpinCountReel = [freeSpinCountReels[0],freeSpinCountReels[1]]
                                for (let i = 0; i < freeSpinCountReel.length; i++) {
                                    freeSpinCount+=freeSpinCountReel[i];
                                }
                                player.freeSpinCount = freeSpinCount;
                                player.gameMode = 1;
                            }else{
                                let lineData=[];
                                let lineMultiplier=1;
                                let sym = 0;
                                let currentWin = 0;
                                let currWinData = {};
                                for(let l=0;l<lines.length;l++){
                                    currentWin = 0;
                                    currWinData = {};
                                    lineData = [ reels[1][lines[l][0]],reels[2][lines[l][1]],reels[3][lines[l][2]],reels[4][lines[l][3]],reels[5][lines[l][4]]];
                                    for (let s = 0; s < lineData.length; s++) {
                                        if(lineData[s]!=wild && lineData[s]!=scatter){
                                            sym = lineData[s];
                                        }
                                    }
                                    if(( lineData[0]==sym || lineData[0]==wild ) && ( lineData[1]==sym || lineData[1]==wild ) && ( lineData[2]==sym || lineData[2]==wild ) && ( lineData[3]==sym || lineData[3]==wild ) && ( lineData[4]==sym || lineData[4]==wild )){
                                        currentWin = payoutTable[sym][4] * data.type;
                                        currWinData = {
                                            symbol:sym,
                                            lineNumber:l+1,
                                            line:lines[l],
                                            lineData:lineData,
                                            symbolCount:5,
                                            winBeforMultiplier:currentWin,
                                            win:currentWin,
                                            lineMultiplier:lineMultiplier,
                                        }
                                    }else if(( lineData[0]==sym || lineData[0]==wild ) && ( lineData[1]==sym || lineData[1]==wild ) && ( lineData[2]==sym || lineData[2]==wild ) && ( lineData[3]==sym || lineData[3]==wild )){
                                        currentWin = payoutTable[sym][3] * data.type;
                                        currWinData = {
                                            symbol:sym,
                                            lineNumber:l+1,
                                            line:lines[l],
                                            lineData:lineData,
                                            symbolCount:4,
                                            winBeforMultiplier:currentWin,
                                            win:currentWin,
                                            lineMultiplier:lineMultiplier,
                                        }
                                    }else if(( lineData[0]==sym || lineData[0]==wild ) && ( lineData[1]==sym || lineData[1]==wild ) && ( lineData[2]==sym || lineData[2]==wild )){
                                        currentWin = payoutTable[sym][2] * data.type;
                                        currWinData = {
                                            symbol:sym,
                                            lineNumber:l+1,
                                            line:lines[l],
                                            lineData:lineData,
                                            symbolCount:3,
                                            winBeforMultiplier:currentWin,
                                            win:currentWin,
                                            lineMultiplier:lineMultiplier,
                                        }
                                    }
                    
                                    if(currentWin>0){
                                        win+=currentWin;
                                        winData.push(currWinData);
                                    }
                                }
                            }
                            player.gameWin += win;
                        }
                    }
                    
                    if(currentGameMode == 1){
                        reels = {
                            1: await generateRandomReelRedBus(freeSpinReelStrip[1]),
                            2: await generateRandomReelRedBus(freeSpinReelStrip[2]),
                            3: await generateRandomReelRedBus(freeSpinReelStrip[3]),
                            4: await generateRandomReelRedBus(freeSpinReelStrip[4]),
                            5: await generateRandomReelRedBus(freeSpinReelStrip[5]),
                        }
                        let multipleryReel = { 1: [1, 1, 1], 2: [1, 1, 1], 3: [1, 1, 1], 4: [1, 1, 1], 5: [1, 1, 1], };
                        for (let i = 2; i <= 4; i++) {
                            for (let j = 0; j < 3; j++) {
                                if(player.steckyReel[i][j]!=0 ){
                                    reels[i][j]=0;
                                    multipleryReel[i][j] = player.steckyReel[i][j];
                                }else if(reels[i][j]==0 && player.steckyReel[i][j]==0){
                                    player.steckyReel[i][j] = Math.floor(Math.random() * 2)+2;
                                    multipleryReel[i][j] = player.steckyReel[i][j];
                                }
                            }
                        }
    
                        let lineData=[];
                        let lineMultiplier=1;
                        let sym = 0;
                        let currentWin = 0;
                        let winBeforMultiplier=0;
                        let currWinData = {};
                        for(let l=0;l<lines.length;l++){
                            currentWin = 0;
                            currWinData = {};
                            lineData = [ reels[1][lines[l][0]],reels[2][lines[l][1]],reels[3][lines[l][2]],reels[4][lines[l][3]],reels[5][lines[l][4]]];
                            lineMultiplier = multipleryReel[1][lines[l][0]] * multipleryReel[2][lines[l][1]] * multipleryReel[3][lines[l][2]] * multipleryReel[4][lines[l][3]] * multipleryReel[5][lines[l][4]];
                            for (let s = 0; s < lineData.length; s++) {
                                if(lineData[s]!=wild && lineData[s]!=scatter){
                                    sym = lineData[s];
                                }
                            }
                            if(( lineData[0]==sym || lineData[0]==wild ) && ( lineData[1]==sym || lineData[1]==wild ) && ( lineData[2]==sym || lineData[2]==wild ) && ( lineData[3]==sym || lineData[3]==wild ) && ( lineData[4]==sym || lineData[4]==wild )){
                                
                                winBeforMultiplier = payoutTable[sym][4] * data.type ;
                                currentWin = winBeforMultiplier * lineMultiplier;
                                currWinData = {
                                    symbol:sym,
                                    lineNumber:l+1,
                                    line:lines[l],
                                    lineData:lineData,
                                    symbolCount:5,
                                    winBeforMultiplier:winBeforMultiplier,
                                    win:currentWin,
                                    lineMultiplier:lineMultiplier,
                                }
                            }else if(( lineData[0]==sym || lineData[0]==wild ) && ( lineData[1]==sym || lineData[1]==wild ) && ( lineData[2]==sym || lineData[2]==wild ) && ( lineData[3]==sym || lineData[3]==wild )){
                                winBeforMultiplier = payoutTable[sym][3] * data.type ;
                                currentWin = winBeforMultiplier * lineMultiplier;
                                currWinData = {
                                    symbol:sym,
                                    lineNumber:l+1,
                                    line:lines[l],
                                    lineData:lineData,
                                    symbolCount:4,
                                    winBeforMultiplier:winBeforMultiplier,
                                    win:currentWin,
                                    lineMultiplier:lineMultiplier,
                                }
                            }else if(( lineData[0]==sym || lineData[0]==wild ) && ( lineData[1]==sym || lineData[1]==wild ) && ( lineData[2]==sym || lineData[2]==wild )){
                                winBeforMultiplier = payoutTable[sym][2] * data.type ;
                                currentWin = winBeforMultiplier * lineMultiplier;
                                currWinData = {
                                    symbol:sym,
                                    lineNumber:l+1,
                                    line:lines[l],
                                    lineData:lineData,
                                    symbolCount:3,
                                    winBeforMultiplier:winBeforMultiplier,
                                    win:currentWin,
                                    lineMultiplier:lineMultiplier,
                                }
                            }
    
                            if(currentWin>0){
                                win+=currentWin;
                                winData.push(currWinData);
                            }
    
                        }
                        player.freeSpinWin+=win;
                        player.gameWin += win;
                        if(player.freeSpinCount >0){
                            player.freeSpinCount--;
                        }
                        if(player.freeSpinCount ==0){
                            player.gameMode = 0;
                        }
    
                    }
                    if(currentGameMode==0 || currentGameMode == 1){
                        player.gameStep++;
                        balance+=win;
                        response= {
                            step:player.gameStep,
                            currentGameMode:currentGameMode,
                            nextGameMode:player.gameMode,
                            bet:bet,
                            win:win,
                            beforBalance:beforBalance,
                            afterBalance:balance,
                            gameWin:player.gameWin,
                            freeSpinWin:player.freeSpinWin,
                            reels:await convertReel(reels),
                            winData:winData,
                            freeSpinCountReel:freeSpinCountReel,
                            freeSpinCount:player.freeSpinCount,
                            steckyReel:await convertReel(player.steckyReel),
                            isAnticipate:isAnticipate,
                        };
                        Sys.Game.Common.Services.PlayerServices.updateCoustomer({ _id: mongoose.Types.ObjectId(data.playerId) },{balance:balance});
                        redis.set(redisUserId, JSON.stringify(player),'EX',expirationInSeconds)
                    }
                    return {
                        statusCode:1,
                        message:"Success",
                        result:response
                    }
                }else{
                    return {
                        statusCode: 0,
                        message: "Player not found",
                        result: null
                    }
                }
                
            }else{
                return {
                    statusCode: 0,
                    message: "Game not found",
                    result: null
                }
            }
            
        } catch (e){
            console.log("Error",e);
            
            return {
                statusCode: 0,
                message: "Something went wrong",
                result: null
            }
        }
    },
    
}


//Gaenerate random reels
async function generateRandomReelRedBus(reelStrip){
    let randomInt = Math.floor(Math.random() * (reelStrip.length));
    let resultReel = [];
    resultReel.push(reelStrip[(randomInt+0)%reelStrip.length]);
    resultReel.push(reelStrip[(randomInt+1)%reelStrip.length]);
    resultReel.push(reelStrip[(randomInt+2)%reelStrip.length]);
    return resultReel;
}


//Convert reel
async function convertReel(reels){
    let response = [
      { reel: reels[1] },
      { reel: reels[2] },
      { reel: reels[3] },
      { reel: reels[4] },
      { reel: reels[5] },
    ];
    return response;
}

