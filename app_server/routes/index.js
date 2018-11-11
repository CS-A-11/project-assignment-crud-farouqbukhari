var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

var ctrlMain = require('../controllers/main');
var ctrlCheckout = require('../controllers/checkout');
var ctrlAbout = require('../controllers/about');
var ctrlproducts = require('../controllers/products');
var ctrladdcart = require('../controllers/addtocart');
var ctrlshoppingcart = require('../controllers/shoppingCart');


/* GET home page. */
router.get('/',ctrlMain.index);
/* GET product page. */
router.get('/products/:category',ctrlproducts.products);
/* GET about page. */
router.get('/about',ctrlAbout.about);
/* GET checkout page. */
router.get('/checkout',isLoggedin,ctrlCheckout.checkout);
router.post('/checkout',isLoggedin,ctrlCheckout.checkoutpost);
/* GET addtocart req. */
router.get('/add-to-cart/:id',ctrladdcart.cart);
/* GET reduceByOne req. */
router.get('/reduce/:id',ctrladdcart.reducecart);
/* GET removeAll req. */
router.get('/remove/:id',ctrladdcart.removeAllcart);
/* GET shoppingcart req. */
router.get('/shopping-cart',ctrlshoppingcart.shoppingcart);
/* Get Product by category*/ 
router.get('/product/:category',ctrlproducts.products);
/* Get Single Product View*/ 
router.get('/product/view/:productid',ctrlproducts.productsreadone);
/* Post Single Product Review*/ 
router.post('/product/view/:productid/review',ctrlproducts.productsaddreview, ctrlproducts.updateRating);
/* Get Edit Review View*/ 
router.get('/product/:productid/review/edit/:reviewid',ctrlproducts.editReviewPage);
/* Post Edit Review*/ 
router.post('/product/:productid/review/edit/:reviewid',ctrlproducts.editReview);
/* Delete Review*/ 
router.get('/product/:productid/review/delete/:reviewid',ctrlproducts.deleteReview);


module.exports = router;

function isLoggedin(req, res , next){
    if(req.isAuthenticated()){
      return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
  }