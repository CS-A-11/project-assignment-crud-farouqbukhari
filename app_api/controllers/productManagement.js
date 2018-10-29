var mongoose = require('mongoose');
var Product = require('../models/product');
var request = require('request');

module.exports.addProductPage = function(req, res, next) {
    var messages = req.flash('error');
    res.render('admin/addProduct', {currentUser: req.user , messages: messages , hasErrors: messages.length > 0});
  };

module.exports.addProduct = function(req, res, next) {
    var errors = false;
    var messages = [];
    if(req.body.title == ""){
        messages.push("Invalid Product Name");
        errors = true;
    }
    if(req.body.description == ""){
        messages.push("Invalid Product Description");
        errors = true;
    }
    if(req.body.price == "" || !(/^\d+$/.test(req.body.price))){
        messages.push("Invalid Product Price");
        errors = true;
    }
    if(req.body.rating == "" || !(/^\d+$/.test(req.body.rating))){
        messages.push("Invalid Product Rating");
        errors = true;
    }
    if(req.body.category == ""){
        messages.push("Invalid Product Category");
        errors = true;
    }
    if(req.body.imgPath == ""){
        messages.push("Invalid Product Image");
        errors = true;
    }
    if(errors){
        res.render('admin/addProduct', {currentUser: req.user , messages: messages , hasErrors: messages.length > 0});
    }
    else{
        Product.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            rating: req.body.rating,
            category: req.body.category,
            imagePath: req.body.imgPath
        },function(err, product){
            if (err){
                res.send(err);
            }
            res.json({"message": "Successfully Added" , "product" : product});
        });
    }
    
};

module.exports.deleteProductPage = function(req, res, next) {
    Product.find(function(err , docs){
        var ProductChunk = [];
        var chunkSize = 4;
        for(var i = 0; i < docs.length ; i+=chunkSize){
          ProductChunk.push(docs.slice(i, i+chunkSize));
        }
        res.render('admin/deleteProduct', {currentUser: req.user ,  products: ProductChunk});
      });
};

module.exports.deleteProduct = function(req, res, next) {
    var productId = req.params.productId;
    console.log(productId);
    var requestOptions = {
        url : "https://techifierkart.herokuapp.com/admin/deleteProducts/" + productId,
        method : "DELETE",
        json: {}
    };
    request(requestOptions , function(err, response, body){
        deleteProduct(req,res , productId);
    });
};

var deleteProduct = function(req , res , productId){
    if(productId)
    {
        Product.findByIdAndDelete(productId,function(err, product){
            if(err){
                res.send(err);
            }
        res.json({"message": "Successfully Deleted"});
        });
    }
    else{
        res.json({"message": "No Product Id"});
    }
};
