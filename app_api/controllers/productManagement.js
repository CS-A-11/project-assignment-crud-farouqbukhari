var mongoose = require('mongoose');
var Product = require('../models/product');
var request = require('request');

module.exports.addProductPage = function(req, res, next) {
    res.render('admin/addProduct', {currentUser: req.user});
  };

module.exports.addProduct = function(req, res, next) {
    sendJSONresponse(res,200,{"status": "success"});
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
                sendJSONresponse(res,404,err);
                return ;
            }
        sendJSONresponse(res,204,{"message": "Successfully Deleted"});
        });
    }
    else{
        sendJSONresponse(res,404 , {"message": "No Product Id"});
    }
};

var sendJSONresponse = function(res,status,content){
    res.status(status);
    res.json(content);
};
