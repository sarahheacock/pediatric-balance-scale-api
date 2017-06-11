'use strict';

var nodemailer = require('nodemailer');
var express = require("express");

var userRoutes = express.Router();
var Page = require("../models").Page;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

userRoutes.param("pageID", function(req, res, next, id){
  Page.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.page = doc;
    return next();
  });
});

userRoutes.param("section", function(req,res,next,id){
  req.section = req.page[id];
  if(!req.section){
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

userRoutes.param("sectionID", function(req, res, next, id){
  req.oneSection = req.section.id(id);
  if(!req.oneSection){
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//================MAIL==================================
userRoutes.post("/sayHello", function(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
        auth: {
            user: 'balanace.test@gmail.com', // Your email id
            pass: 'GC9hXE6uQNJyMWJw' // Your password
        }
    });

    //var text = 'Hello world from \n\n' + req.body.name;

    var mailOptions = {
        from: '"Nancy Darr" <balanace.test@gmail.com>', // sender address
        to: 'seheacock@bellsouth.net', // list of receivers
        subject: 'Email Example', // Subject line
        //text: text //, // plaintext body
        html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
            res.json({yo: 'error'});
        }
        else {
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });

});

//===================GET SECTIONS================================
//get page
userRoutes.get("/:pageID", function(req, res){
  res.json(req.page);
});

//get section
userRoutes.get("/:pageID/:section", function(req, res){
  res.json(req.section);
});




module.exports = userRoutes;
