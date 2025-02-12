var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {

    lineMaster: async function(req, res) {
        try {
            let roleData = await Sys.App.Services.UserServices.getRole({ name: req.session.details.name })
            console.log("roleData", roleData);
            let userChips = await Sys.App.Services.UserServices.getByData({_id : req.session.details.id})
            req.session.details.chips = parseFloat(userChips[0].chips).toFixed(2)
            var roleApprove

            console.log('11111');
            if (roleData == null) {
                console.log('22222');

                roleApprove = ""
            } else {
                console.log('33333');

                roleApprove = roleData.permission['Line Master']
            }
            let line = await Sys.App.Services.LineServices.getByLine({ game: req.params.id });
            console.log("line", line);
            let rows = await Sys.App.Services.AllModelService.getByRow({ game: req.params.id });
            console.log("rows", rows);

            let reels = await Sys.App.Services.AllModelService.getByReel({ game: req.params.id });
            console.log("reels", reels);

            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                role: req.session.details.role,
                lines: line,
                rows: 3,
                reels: 5,
                gameId: req.params.id,
                roleData: roleApprove,
                lineMasterActive: 'active'
            };
            return res.render('slotGame/line/index', data);
        } catch (error) {
            Sys.Log.info('Error in lineMaster : ' + error);
            return new Error('Error in lineMaster');
        }
    },

    createLine: async function(req, res) {
        try {
            let gameId = req.params.gameId;
            let rows = await Sys.App.Services.AllModelService.getByRow({ game: gameId });
            console.log("rows", rows);
            let reels = await Sys.App.Services.AllModelService.getByReel({ game: gameId });
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                role: req.session.details.role,
                slotGames: 'active',
                rows: rows,
                reels: reels,
                gameId: gameId
            };
            return res.render('slotGame/line/create', data);
        } catch (error) {
            Sys.Log.info('Error in createLine : ' + error);
            return new Error('Error in createLine');
        }
    },

    postCreateLine: async function(req, res) {
        try {
            let data = req.body;
            console.log("postCreateLine data : ", data);
            var keys = Object.keys(data);
            let data1 = {};
            for (let i = 0; i < keys.length; i++) {
                if (i === 1 || i === 0) { continue; }
                var val = keys[i].split(",");
                if (data1[val[0]]) {
                    data1[val[0]][val[1]] = true;
                } else {
                    data1[val[0]] = {};
                    data1[val[0]][val[1]] = true;
                }
            }
            let getLine = await Sys.App.Services.LineServices.createLine({
                name: req.body.name,
                matrix: data1,
                game: req.body.gameId
            });
            if (getLine) {
                req.flash('success', 'Line create successfully');
                res.redirect('/lineMaster/' + req.body.gameId);
            } else {
                req.flash('error', 'Line Not create');
                res.redirect('/lineMaster/' + req.body.gameId);
            }
        } catch (error) {
            Sys.Log.info('Error in postCreateLine : ' + error);
            return new Error('Error in postCreateLine');
        }
    },

    editLine: async function(req, res) {
        try {
            let gameId = req.params.gameId;
            let lineId = req.params.id;
            let line = await Sys.App.Services.LineServices.getOneLine({ _id: lineId });
            let rows = await Sys.App.Services.AllModelService.getByRow({ game: gameId });
            let reels = await Sys.App.Services.AllModelService.getByReel({ game: gameId });
            let lineMatrix = {};
            for (var r = 0; r < rows.length; r++) {
                if (line.matrix[rows[r].id]) {
                    lineMatrix[rows[r].id] = [];
                    for (var l = 0; l < reels.length; l++) {
                        if (line.matrix[rows[r].id][reels[l].id] == true) {
                            // console.log("successfully",line.matrix[rows[r].id]);
                            lineMatrix[rows[r].id].push(reels[l].id);
                        }
                    }
                }
            }
            console.log("lineMatrix", lineMatrix);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                rows: rows,
                reels: reels,
                line: line,
                matrix: lineMatrix,
                lineMasterActive: 'active'
            };
            return res.render('slotGame/line/edit', data);
        } catch (error) {
            Sys.Log.info('Error in editLine : ' + error);
            return new Error('Error in editLine');
        }
    },

    postEditLine: async function(req, res) {
        try {
            console.log("req postEditLine data ----->", req.body);
            let data = req.body;
            // console.log("postCreateLine data : ",data);
            var keys = Object.keys(data);
            let data1 = {};
            for (let i = 0; i < keys.length; i++) {
                if (i === 1 || i === 0 || i === 2) { continue; }
                var val = keys[i].split(",");
                if (data1[val[0]]) {
                    data1[val[0]][val[1]] = true;
                } else {
                    data1[val[0]] = {};
                    data1[val[0]][val[1]] = true;
                }
            }
            await Sys.App.Services.LineServices.updateLine({ _id: req.body.lineId }, {
                name: req.body.name,
                matrix: data1
            });

            req.flash('success', 'Line update successfully');
            res.redirect('/lineMaster/' + req.body.gameId);
        } catch (error) {
            Sys.Log.info('Error in postEditLine : ' + error);
            return new Error('Error in postEditLine');
        }
    },

    lineDelete: async function(req, res) {
        try {
            let line = await Sys.App.Services.LineServices.getOneLine({ _id: req.body.id });
            if (line || line.length > 0) {
                await Sys.App.Services.LineServices.deleteLine(req.body.id)
                return res.send("success");
            } else {
                return res.send("error");
            }
        } catch (error) {
            Sys.Log.info('Error in lineDelete : ' + error);
            return new Error('Error in lineDelete');
        }
    }
}