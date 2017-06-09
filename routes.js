'use strict';

var express = require("express");
var router = express.Router();
var Page = require("./models").Page;
var bcrypt = require('bcrypt');

router.param("pageID", function(req, res, next, id){
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

router.param("section", function(req,res,next,id){
  req.section = req.page[id];
  if(!req.section){
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

router.param("username", function(req, res, next, id){
  //User.findById(id, function(err, doc){
  Page.findOne({username: id}).exec(function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Username Not Found");
      err.status = 404;
      return next(err);
    }
    req.user = doc;
    return next();
  });
});

router.param("password", function(req, res, next, id){
  bcrypt.compare(id, req.user.password, function(error, result){
    if(result === false){
      var err = new Error("Incorrect Password");
      err.status = 404;
      return next(err);
    }
    return next();
  });
});


//===================GET, EDIT, AND DELETE SECTIONS IN PAGE[0]=================
//authenticate user
router.get("/admin/:username/:password", function(req, res){

  res.json({"admin":true, "id":{"id": req.user._id}});
});

//create new page/user
// router.post("/", function(req, res, next){
//   var page = new Page(req.body);
//   page.save(function(err, user){
//     if(err) return next(err);
//     res.status(201);
//     res.json(user);
//   });
// });

//get page
router.get("/:pageID", function(req, res){
  res.json(req.page);
});

//get section
router.get("/:pageID/:section", function(req, res){
  res.json(req.section);
});



module.exports = router;
