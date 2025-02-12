var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var helper = require('../../Helper/helper');
var dateformat = require('dateformat');
const mongoose = require('mongoose');
const fs = require('fs');

module.exports = {
    games: async function(req,res){
        try{
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameMangement: 'active',
                role: req.session.details.role
            };
            return res.render('slotGame/games', data);
        }catch(e){

        }
    },
    getGames: async function(req,res){
        try{
                console.log("req.query",req.query);
                let start = parseInt(req.query.start);
                let length = parseInt(req.query.length);
                let search = req.query.search.value;
                let query = {};
                if (search != '') {
                    query = { name: { $regex: '.*' + search + '.*' } };
                }
                console.log("query",query);
                let gameCount = await Sys.App.Services.GameService.getGameCount(query);
                let data = await Sys.App.Services.GameService.getGame(query, length, start);
                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': gameCount,
                    'recordsFiltered': gameCount,
                    'data': data
                };
               return res.send(obj);
             
        }catch(e){
            console.log('Error in getTheme : ', e);
            return new Error('Error in getTheme');
        }
    },
    addGame:async function(req,res){
        try{
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameMangement: 'active',
                role: req.session.details.role
            };
            return res.render('slotGame/addGame', data);
        }catch(e){

        }
    },

    addPostGame:async function(req,res){
        try{
            console.log("req.files",req.files );
            let gameBg = ""
            let gameIcon = ""
            let reelBg = ""
            let reelFrame = ""
            // if(req.files.gameBackground){
            //     let gameBackground = req.files.gameBackground
            //     var re = /(?:\.([^.]+))?$/;
            //     var ext = re.exec(gameBackground.name)[1];
            //     gameBg = Date.now() + '.' + ext;
            //     gameBackground.mv('./public/uploads/' + gameBg, async function(err) {
            //         if (err) {
            //             req.flash('error', 'Error uploading game background');
            //             return res.redirect('/games');
            //         }
            //     })
            // }
            if(req.files.game_icon){
                let game_icon = req.files.game_icon
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(game_icon.name)[1];
                gameIcon = Date.now() + '.' + ext;
                game_icon.mv('./public/uploads/' + gameIcon, async function(err) {
                    if (err) {
                        req.flash('error', 'Error uploading game icon');
                        return res.redirect('/games');
                    }
                })
            }
            // if(req.files.reel_bg){
            //     let reel_bg = req.files.reel_bg
            //     var re = /(?:\.([^.]+))?$/;
            //     var ext = re.exec(reel_bg.name)[1];
            //     reelBg = Date.now() + '.' + ext;
            //     reel_bg.mv('./public/uploads/' + reelBg, async function(err) {
            //         if (err) {
            //             req.flash('error', 'Error uploading reel background');
            //             return res.redirect('/games');
            //         }
            //     })
            // }
            // if(req.files.reel_frame){
            //     let reel_frame = req.files.reel_frame
            //     var re = /(?:\.([^.]+))?$/;
            //     var ext = re.exec(reel_frame.name)[1];
            //     reelFrame = Date.now() + '.' + ext;
            //     reel_frame.mv('./public/uploads/' + reelFrame, async function(err) {
            //         if (err) {
            //             req.flash('error', 'Error uploading reel frame');
            //             return res.redirect('/games');
            //         }
            //     })
            // }
            console.log("game",  req.body.name, gameBg,gameIcon,reelBg,reelFrame);
            let game = await Sys.App.Services.GameService.createGame({
                name: req.body.name,
                // theme_bg: gameBg,
                theme_icon: "/uploads/"+gameIcon,
                // reel_bg: reelBg,
                // reel_frame: reelFrame
            });
            if(game){
                console.log("game1111",game);
                return res.redirect('/symbolManagement/'+ game._id)                
            }else{
                req.flash('error', 'Error creating game.');
                return res.redirect('/games');
            }
        }catch(e){

        }
    },

    symbolManagement:async function(req,res){
        try{
            console.log("req.params2",req.params);
            let symbols = await Sys.App.Services.GameService.findSymbols({gameId:req.params.gameId})
            let game = await Sys.App.Services.GameService.findSingleGame({_id:req.params.gameId})
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameMangement: 'active',
                role: req.session.details.role,
                symbol:symbols.length,
                gameId:req.params.gameId,    
                gameName:game.name                
            };
            console.log("symbol",data.symbol);
                return res.render('symbols/symbol', data);
        }catch(e){
            console.log("error",e);
        }
    },

    getSymbols:async function(req,res){
        try{
            console.log("req.params1",req.query);
            let symbol = await Sys.App.Services.GameService.findSymbols({gameId:req.query.gameId})
            console.log("symbol",symbol);
            var obj = {
                'draw': req.query.draw,
                'data': symbol
            };
            res.send(obj);
            return false
        }catch(e){
            console.log("error",e);
        }
    },
    addSymbol: async function(req,res){
        try{
            let game = await Sys.App.Services.GameService.findSingleGame({_id:req.params.gameId})
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameMangement: 'active',
                role: req.session.details.role,
                gameId:req.params.gameId,    
                gameName:game.name,

            };
            return res.render('symbols/edit', data);
        }catch(e){
            console.log("error",e);
        }
    },

    addPostSymbol: async function(req,res){
        try{
            console.log("req.body",req.body);
            let game = await Sys.App.Services.GameService.findSingleGame({_id:req.params.gameId})
            console.log("game2", game );
            let symbolImage = ""
            if(req.files.image){
                let image = req.files.image
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(image.name)[1];
                symbolImage = Date.now() + '.' + ext;
                image.mv('./public/uploads/symbol/' + symbolImage, async function(err) {
                    if (err) {
                        req.flash('error', 'Error uploading symbol image. Please ensure the file format is supported and try again.');
                        return res.redirect('/symbolManagement/'+ game._id);
                    }
                })
            }
            let symbol = await Sys.App.Services.GameService.createSymbol({
                symbol: req.body.symbol,
                symbol_type:req.body.symbolType,
                image: '/uploads/symbol/'+symbolImage,
                gameId:game._id
            })
            if(symbol){
                console.log("game._id",game._id);
                req.flash('success', 'Symbol added successfully! Your changes have been saved.');
                return res.redirect('/symbolManagement/'+ game._id)
            }else{
                req.flash('error', 'Unable to add the symbol. Please check your input and try again.');
                return res.redirect('/symbolManagement/'+ game._id)
            }
        }catch(e){
            console.log("error",e);

        }
    },

    editSymbol:async function(req,res){
        try{
            let symbol = await Sys.App.Services.GameService.findSingleSymbol({_id:req.params.id})
            let game = await Sys.App.Services.GameService.findSingleGame({_id:symbol.gameId})
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameMangement: 'active',
                role: req.session.details.role,
                gameId:game._id,    
                gameName:game.name,
                symbol:symbol

            };
            return res.render('symbols/edit', data);
        }catch(e){
            console.log("error",e);
        }
    },
    editPostSymbol: async function(req,res){
        try{
            console.log("req.params",req.params,req.body);
            let symbol = await Sys.App.Services.GameService.findSingleSymbol({_id:req.params.id})
            console.log("symbol",symbol);
            if(symbol){
                let symbolImage = ""
                if(req.files.image){
                    const filePath = './public/uploads/symbol/' + symbol.image;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                            // Handle error, if needed
                        } else {
                            console.log('File deleted successfully');
                        }
                    });
                    let image = req.files.image
                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(image.name)[1];
                    symbolImage = Date.now() + '.' + ext;
                    image.mv('./public/uploads/symbol/' + symbolImage, async function(err) {
                        if (err) {
                            req.flash('error', 'Error uploading symbol image. Please ensure the file format is supported and try again.');
                            return res.redirect('/symbolManagement/'+ game._id);
                        }
                    })
                }else{
                    symbolImage = symbol.image
                }
                await Sys.App.Services.GameService.updateSymbol({
                    _id:symbol._id
                },{
                    symbol: req.body.symbol,
                    symbol_type:req.body.symbolType,
                    image: symbolImage,
                })
                req.flash('success','Symbol updated successfully! Your changes have been saved.')
                return res.redirect('/symbolManagement/'+symbol.gameId)
            }else{
                req.flash('success','An error occurred. Please try again.')
                return res.redirect('/symbolManagement/'+symbol.gameId)
            }
        }catch(e){
            console.log("error",e);

        }
    },
    editGame: async function(req,res){
        try{
            let game = await Sys.App.Services.GameService.findSingleGame({_id:req.params.id})
            data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameMangement: 'active',
                role: req.session.details.role,
                game:game
            }
            return res.render('slotGame/addGame',data)
        }catch(e){

        }
    },
    editPostGame: async function(req,res){
        try{
            console.log("req.files",req.files);
            let game = await Sys.App.Services.GameService.findSingleGame({_id:req.params.id}) 
            let gameBg = ""
            let gameIcon = ""
            let reelBg = ""
            let reelFrame = ""
            if(req.files.gameBackground){
                const filePath = './public/uploads/' + game.theme_bg;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        // Handle error, if needed
                    } else {
                        console.log('File deleted successfully');
                    }
                });
                let gameBackground = req.files.gameBackground
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(gameBackground.name)[1];
                gameBg = Date.now() + '.' + ext;
                gameBackground.mv('./public/uploads/' + gameBg, async function(err) {
                    if (err) {
                        req.flash('error', 'Error uploading game background');
                        return res.redirect('/games');
                    }
                })
            }else{
                gameBg =  game.theme_bg
            }
            if(req.files.game_icon){
                const filePath = './public/uploads/' + game.theme_icon;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        // Handle error, if needed
                    } else {
                        console.log('File deleted successfully');
                    }
                });
                let game_icon = req.files.game_icon
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(game_icon.name)[1];
                gameIcon = Date.now() + '.' + ext;
                game_icon.mv('./public/uploads/' + gameIcon, async function(err) {
                    if (err) {
                        req.flash('error', 'Error uploading game icon');
                        return res.redirect('/games');
                    }
                })
            }else{
                gameIcon = game.theme_icon
            }
            if(req.files.reel_bg){
                const filePath = './public/uploads/' + game.reel_bg;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        // Handle error, if needed
                    } else {
                        console.log('File deleted successfully');
                    }
                });
                let reel_bg = req.files.reel_bg
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(reel_bg.name)[1];
                reelBg = Date.now() + '.' + ext;
                reel_bg.mv('./public/uploads/' + reelBg, async function(err) {
                    if (err) {
                        req.flash('error', 'Error uploading reel background');
                        return res.redirect('/games');
                    }
                })
            }else{
                reelBg =  game.reel_bg     
            }
            if(req.files.reel_frame){
                const filePath = './public/uploads/' + game.reel_frame;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        // Handle error, if needed
                    } else {
                        console.log('File deleted successfully');
                    }
                });
                let reel_frame = req.files.reel_frame
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(reel_frame.name)[1];
                reelFrame = Date.now() + '.' + ext;
                reel_frame.mv('./public/uploads/' + reelFrame, async function(err) {
                    if (err) {
                        req.flash('error', 'Error uploading reel frame');
                        return res.redirect('/games');
                    }
                })
            }else{
                reelFrame =  game.reel_frame
            }
            if(game){
                await Sys.App.Services.GameService.updateGame({_id:req.params.id},{
                    name:req.body.name,
                    theme_bg:gameBg,
                    theme_icon:gameIcon,
                    reel_bg:reelBg,
                    reel_frame:reelFrame
                })
                req.flash('success','Game updated successfully! Your changes have been saved.')
                return res.redirect('/games')
            }else{
                req.flash('success','Data not found. Please try again.')
                return res.redirect('/games')
            }
        }catch(e){
            console.log("error",e);
        }
    },
    deleteGame:async function(req,res){
        try{
            let game = await Sys.App.Services.GameService.findSingleGame({_id:req.body.id})
            if(game){
                await Sys.App.Services.GameService.deleteGame({_id:req.body.id})
                await Sys.App.Services.GameService.deleteSymbol({gameId:req.body.id})
                return res.send("success")
            }else{
                return res.send("error")

            }
        }catch(e){
            console.log("error",e);

        }
    }

  
    
}