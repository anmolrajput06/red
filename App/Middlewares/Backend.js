var Sys = require('../../Boot/Sys');
var url  = require('url');
module.exports = {
    loginCheck: function(req, res, next) {
        if (req.session.login) {
            if(req.session.details.role == "cashier"){
                return res.redirect('/drawer');
            }else{
            return res.redirect('/dashboard');
            }
        } else {
            next();
        }
    },
    Authenticate: async function(req, res, next) {
        if (req.session.login) {
            next();
        } else {
            res.redirect('/');
        }
        // next();
    },
    HasRole: function(...allowed) {
        const isAllowed = role => allowed.indexOf(role) > -1;
        return function(req, res, next) {
            console.log("isAllowed",typeof isAllowed(req.session.details.role));
            console.log("role",req.session.details.role);
            if (!isAllowed(req.session.details.role)) {
                console.log("if codition");
                req.flash('error', 'You are Not allowed to access that page.');
                return res.redirect('/');
            } else{ 
                console.log("else condition");
                next()};
        }
    },
}