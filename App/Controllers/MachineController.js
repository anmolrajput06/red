var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var helper = require('../../Helper/helper');
var dateformat = require('dateformat');
const mongoose = require('mongoose');
const crypto = require('crypto');
const passphrase = 'maddyNode@Gamecrio';
const salt = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
module.exports = {
    machineManagement: async function (req, res) {
        try {
            let machines = [{
                name:"1",
                status:"disconnected"
            },{
                name:"2",
                status:"connected"
            },{
                name:"3",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            },{
                name:"4",
                status:"disconnected"
            }]
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                machineManagement: 'active',
                role: req.session.details.role,
                machines:machines,
                machinesLength:machines.length,
            };
            return res.render('machine/machine', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    customers: async function(req,res){
        try{
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search;

            let query = { role: "customer" , userId: mongoose.Types.ObjectId(req.session.details.id)} 

           
            if (req.query.type != "" && req.query.search != '') {
                if(req.query.type == "name"){
               query["firstName"] = { $regex: '.*' + search + '.*' }
                }else{
               query["uniqueId"] = { $regex: '.*' + search + '.*' }

                }
            }
            console.log("getCustomers query",typeof query.userId);
            let data = await Sys.App.Services.CustomerServices.getcustomerDatatable(query, start, length);
            let dataCount = await Sys.App.Services.CustomerServices.getcustomerCount(query);
            console.log("dataCount", data);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        }catch(e){
            console.log("Error", e);
        }
    },
    addcustomer: async function(req,res){
        try{
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                customerMangement: 'active',
                role: req.session.details.role
            };
            return res.render('customer/addcustomer', data);
        }catch(e){
            console.log("Error", e);
        }
    },

    addPostcustomer: async function(req,res){
        try{
            console.log("req.body addPostcustomer",req.body);
            let user = await Sys.App.Services.UserServices.getSingleUserData({_id:req.session.details.id})
           let customer = await Sys.App.Services.CustomerServices.createUser({
                userId:req.session.details.id,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.mail,
                role:'customer',
                mobile:req.body.phone,
                license:req.body.license,
                uniqueId:req.body.pin,
                timeZone:user.timeZone,
                comunityPrice:user.comunityPrice,
                gender:req.body.gender
            })
            if (customer){
                return res.send("success")
            }
        }catch(e){
            console.log("Error", e);
        }
    },
    viewcustomer: async function(req,res){
        try{
            console.log("req.body",req.body);
            let customer = await Sys.App.Services.CustomerServices.findOneUser({_id:req.body.userId})
            console.log("customer",customer);
            if(customer){
                let obj = {
                    status:"success",
                    pinID:customer.uniqueId,
                    license:customer.license,
                    firstName:customer.firstName,
                    lastName:customer.lastName,
                    mobile:customer.mobile,
                    mail:customer.email,
                    gender:customer.gender,
                    userId:customer._id
                }
//                 const dataToEncrypt = obj;
//                 const jsonString = JSON.stringify(dataToEncrypt);
//                 const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//   let encryptedData = cipher.update(jsonString, 'utf-8', 'hex');
//   encryptedData += cipher.final('hex');

//   const response = {
//     encryptedData: encryptedData,
//     iv: iv.toString('hex'),
//   };
                


                return res.send(obj)

            }
        }catch(e){
            console.log("Error", e);
        }
    },
    viewSinglecustomer: async function(req,res){
        try{
            console.log("req.body",req.body);
            let customer = await Sys.App.Services.CustomerServices.findOneUser({uniqueId:req.body.uniqueId})
            console.log("customer",customer);
            if(customer){
                let cashier = await Sys.App.Services.UserServices.getSingleUserData({_id:customer.userId})
                console.log("cashier",cashier);
                let shop = await Sys.App.Services.UserServices.getSingleUserData({_id:cashier.userId})
                let obj ={
                    status:"success",
                    cashierName : cashier.name,
                    shopName : shop.name
                }
                return res.send(obj);
            }
        }catch(e){
            console.log("Error", e);
        }
    },
    editcustomer:async function(req,res){
        try{
            console.log("req.body editPostcustomer",req.body);
           let customer = await Sys.App.Services.CustomerServices.updatecustomer({_id:req.body.userId},{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.mail,
                mobile:req.body.phone,
                license:req.body.license,
                gender:req.body.gender
            })
                return res.send("success")
        }catch(e){
            console.log("Error", e)
        }
    }
   
}
function isBcryptHash(value) {
    // Regular expression to match bcrypt hashes
    const bcryptHashRegex = /^\$2[aby]\$.{56}$/;
  
    return bcryptHashRegex.test(value);
  }