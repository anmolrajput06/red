var express = require('express'),
    router = express.Router();
var Sys = require('../../Boot/Sys');
// Load Your Cutom Middlewares


const cors = require("cors");
router.use(cors());

// ✅ Apply JSON parsing middleware
router.use(express.json());

router.get('/backend', Sys.App.Middlewares.Frontend.frontRequestCheck, function (req, res) {
    res.send('This is Backend')
})



/**
 * Auth Router
 */
router.get('/', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Controllers.Auth.login);
router.post('/', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Middlewares.Validator.loginPostValidate, Sys.App.Controllers.Auth.postLogin);
router.get('/forgot-password', Sys.App.Controllers.Auth.forgotPassword);
router.post('/forgotPassword', Sys.App.Controllers.Auth.forgotPasswordPost);
router.get('/logout', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.logout);


// router.get('/register', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Controllers.Auth.register);

router.get('/profile', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.profile);

router.post('/profile/update', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.profileUpdate);

router.post('/profile/changePwd', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.ChangePassword);
router.post('/validateCurrentPassword', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.validPassword)

router.get('/reset', Sys.App.Controllers.Auth.resetPassword)
router.post('/resetPassword', Sys.App.Controllers.Auth.resetPasswordPost)
/**
 * Dashboard Router
 */
router.get('/dashboard', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Dashboard.home);

/**
 * Super Admin Router
 */
router.get('/distributors', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.distributors);
router.get('/distributor/getDistributor', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.getDistributors)
router.get('/addDistributor', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.addDistributor)
router.post('/addDistributor', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.addPostDistributor)
router.post('/distributor/changeStatus', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor', 'subDistributor', 'shop', 'cashier'), Sys.App.Controllers.DistributorController.changeDistributorStatus)
router.post('/customer/changeStatus', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor', 'subDistributor', 'shop', 'cashier'), Sys.App.Controllers.DistributorController.changeCustomerStatus)
router.get('/distributorsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.editDistributor)
router.post('/distributorsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.editPostDistributor)
router.post('/validateEmail', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor', 'subDistributor', 'shop', 'cashier'), Sys.App.Controllers.DistributorController.validateEmail)
router.post('/validateUserName', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor', 'subDistributor', 'shop', 'cashier'), Sys.App.Controllers.DistributorController.validateUserName)
router.get('/viewSubDistributor/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.viewSubDistributor)
router.get('/distributor/getUsers', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.getUsers)
router.get('/subDistributor/getUsers', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.getSubDistributors)
router.get('/distributor/getShops', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.getShops)
router.get('/subDistributors/shops/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor'), Sys.App.Controllers.DistributorController.getSubdistributorsShops)
router.get('/subDistributors/getShops', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor'), Sys.App.Controllers.DistributorController.getSubdistributorsShopsDetails)
router.get('/subDistributor/shops/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor'), Sys.App.Controllers.DistributorController.getSubdistributorShops)
router.get('/shop/cashier/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor', 'subDistributor'), Sys.App.Controllers.DistributorController.getShopsCashier)
router.get('/shop/cashier', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor', 'subDistributor'), Sys.App.Controllers.DistributorController.getCashier)
router.get('/settings', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.setting)
router.post('/settings/add', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.addSetting)
router.post('/settings/update/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.updateSetting)
router.get('/subDistributorsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.subDistributorsEdit)
router.get('/shopsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor'), Sys.App.Controllers.DistributorController.shopsEdit)
router.get('/shopEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'distributor'), Sys.App.Controllers.DistributorController.shopEdit)
router.get('/adminBetReport', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DistributorController.betReport)
router.get('/adminBetReports/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DistributorController.getBetReportData);
router.get('/distributorProfile/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.DistributorController.distributorProfile);


/**
 * Super Admin Game Router
 */
router.get('/games', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.games)
router.get('/games/getGames/', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.getGames)
router.get('/games/addGame/', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.addGame)
router.post('/games/addGame/', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.addPostGame)
router.get('/symbolManagement/:gameId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.symbolManagement)
router.get('/symbol/getSymbol', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.getSymbols)
router.get('/symbol/addSymbol/:gameId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.addSymbol)
router.post('/symbol/addSymbol/:gameId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.addPostSymbol)
router.get('/symbol/editSymbol/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.editSymbol)
router.post('/symbol/editSymbol/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.editPostSymbol)
router.post('/games/gameDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.deleteGame)
router.get('/games/gameEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.editGame)
router.post('/games/gameEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin'), Sys.App.Controllers.GameController.editPostGame)




/**
 * Distributor Users(Sub Distributor and Shops) Router
 */

router.get('/user', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor'), Sys.App.Controllers.UserController.userManagement)
router.get('/users/getUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor'), Sys.App.Controllers.UserController.getUser)
router.get('/users/addUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor'), Sys.App.Controllers.UserController.addUser)
router.post('/addUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor'), Sys.App.Controllers.UserController.addPostUser)
router.get('/users/editUser/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor'), Sys.App.Controllers.UserController.editUser)
router.post('/editUser/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor', 'admin'), Sys.App.Controllers.UserController.editPostUser)
router.post('/editUsers/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor', 'admin'), Sys.App.Controllers.UserController.editPostUsers)
router.get('/gameSetting', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor'), Sys.App.Controllers.UserController.gameSetting)
router.get('/distributorBetReport/:id?', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.betReport)
router.get('/distributorBetReports/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.getBetReportData);
router.get('/subDistributorProfile/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('distributor', 'admin'), Sys.App.Controllers.UserController.subDistributorProfile);




/**
 * Sub Distributor Users Router
 */
router.get('/shop', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.shopManagement)
router.get('/shops/getShop', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.getShops)
router.get('/shops/addShop', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.addShops)
router.post('/addShop', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.addPostShops)
router.get('/shops/editShop/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.editShops)
router.post('/editShop/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.editPostShops)
router.get('/subDistributor/gameSetting', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor'), Sys.App.Controllers.SubDistributorsController.gameSetting)
router.get('/subDistributor/editCashier/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor', 'distributor', 'admin'), Sys.App.Controllers.SubDistributorsController.editCashier)
router.post('/subDistributerEditCashier/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor', 'distributor', 'admin'), Sys.App.Controllers.SubDistributorsController.editPostCashier)
router.get('/subDistributorBetReport/:id?', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.SubDistributorsController.betReport)
router.get('/subDistributerBetReports/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.SubDistributorsController.getBetReportData);
router.get('/shopProfile/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('subDistributor', 'distributor', 'admin'), Sys.App.Controllers.SubDistributorsController.shopProfile);


/**
 * Shop Users Router 
 */
router.get('/cashier', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop'), Sys.App.Controllers.ShopController.cashierManagement);
router.get('/cashier/getCashier', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop'), Sys.App.Controllers.ShopController.getCashier);
router.get('/cashier/addCashier', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop'), Sys.App.Controllers.ShopController.addCashier);
router.post('/addCashier', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop'), Sys.App.Controllers.ShopController.addPostCashier);
router.get('/cashier/editCashier/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop'), Sys.App.Controllers.ShopController.editCashier)
router.post('/editCashier/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop'), Sys.App.Controllers.ShopController.editPostCashier)
router.get('/shopBetReport/:id?', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ShopController.betReport)
router.get('/shopBetReports/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ShopController.getBetReportData);
router.get('/cashierProfile/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop', 'subDistributor', 'distributor', 'admin'), Sys.App.Controllers.ShopController.cashierProfile);
router.get('/cashier/customer/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('shop', 'subDistributor', 'distributor', 'admin'), Sys.App.Controllers.ShopController.customerList)
router.get('/cashier/customers/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ShopController.getCustomerList);



/**
 * Cashier Router
 */

router.get('/customer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.customerManagement)
router.get('/getcustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.customers)
router.get('/customer/addcustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.addcustomer)
router.post('/addcustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.addPostcustomer)
router.post('/viewcustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.viewcustomer)
router.post('/viewSinglecustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.viewSinglecustomer)
router.post('/editcustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.editcustomer) |
    router.post('/addChips', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.addChips)
router.post('/revertPurchase', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.revertPurchase)
router.post('/revertAmount', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.revertAmount)
router.get('/drawer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.drawerMangement)
router.post('/addAmount', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.addAmount)
router.post('/getCashierBalanceData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.getCashierBalanceData)
router.post('/redeemAmount', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.redeemAmount)
router.post('/revertAmount', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.revertAmount)
router.get('/chipsReport', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.chipsReport)
router.get('/report/getCashHistory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.getCashHistory)
router.get('/selfReport', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.CashierController.selfReport)
router.get('/selfReports/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CashierController.getSelfReportData);
router.get('/betReport/:id?', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CashierController.betReport)
router.get('/customerBetReport/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier', 'admin'), Sys.App.Controllers.CashierController.customerBetReport)
router.get('/betReports/getData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CashierController.getBetReportData);
router.get('/customerProfile/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier', 'shop', 'subDistributor', 'distributor', 'admin'), Sys.App.Controllers.CashierController.customerProfile);

/**
 * Machine Management Router
 */

router.get('/machineManagemen', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('cashier'), Sys.App.Controllers.MachineController.machineManagement)


router.get('/spin', Sys.App.Controllers.CashierController.spin);




// admin penel api's
// const cusromercontroller=require("../Controllers/admin_controller/customer.controller")

// router.post('/customer_list', cusromercontroller.get_customer_data);
router.post('/customer_list', Sys.App.Controllers.CashierController.customer_list);
router.post('/update_status', Sys.App.Controllers.CashierController.updatestatus)
router.post("/update_dailywheeldata",Sys.App.Controllers.DailyController.updateDailyWheeldata)

module.exports = router