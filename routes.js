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

router.param("sectionID", function(req, res, next, id){
  req.oneSection = req.section.id(id);
  if(!req.oneSection){
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


//===================GET SECTIONS AND AUTHENTICATE=================
//authenticate user
router.get("/admin/:username/:password", function(req, res){
  var home = req.user.home.map((h) => (h._id));
  var authors = req.user.authors.map((a) => (a._id));
  var publications = req.user.publications.map((p) => (p._id));
  var news = req.user.publications.map((n) => (n._id));
  res.json({"admin":true, "id":{
      "home":home,
      "authors":authors,
      "publications":publications,
      "news": news
    }
  });
});

//create new page/user
router.post("/", function(req, res, next){
  var page = new Page(req.body);
  page.save(function(err, user){
    if(err) return next(err);
    res.status(201);
    res.json(user);
  });
});

//get page
router.get("/:pageID", function(req, res){
  res.json(req.page);
});

//get section
router.get("/:pageID/:section", function(req, res){
  res.json(req.section);
});

//======================EDIT SECTIONS==============================
//add section
router.post("/:pageID/:section", function(req, res, next){
  req.section.push(req.body);
  req.page.save(function(err, page){
    if(err) return next(err);
    res.status(201);
    res.json(page);
  });
});

router.get("/:pageID/:section/:sectionID", function(req, res){
  res.json(req.oneSection);
});

//edit section
router.put("/:pageID/:section/:sectionID", function(req, res){
  Object.assign(req.oneSection, req.body);
  req.page.save(function(err, result){
    if(err) return next(err);
    res.json(result[req.params.section]);
  });
});

//delete section
router.delete("/:pageID/:section/:sectionID", function(req, res){
  req.oneSection.remove(function(err){
    req.page.save(function(err, page){
      if(err) return next(err);
      res.json(page[req.params.section]);
    })
  })
});


module.exports = router;
