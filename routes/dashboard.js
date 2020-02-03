var express = require('express');
var router = express.Router();

var MongoClient=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectID;
var url="mongodb://localhost:27017/";

let authenticate=function(req,res,next){
  var loggedIn=req.session.isLoggedIn
  if(loggedIn){
    next()
  }else{
    res.redirect('/signin')
  }
}


let authenticated = function (req, res, next) {
  req.session.isLoggedIn=req.session.isLoggedIn ? true:false;
  if (req.session.isLoggedIn) {
    res.locals.user=req.session.user;
    next()
  } else {
    next()
  }
}
router.use(authenticated)

router.use(authenticate)



/* GET home page. */
router.get('/',function (req, res, next) {
    res.render('index', { layout: 'dashboardlayout', title: 'My dashboard',user:req.session.user});
});
//---------


/* get projects listing. */
router.get('/projects', function (req, res, next) {
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    let dbo=db.db("project1");
    dbo.collection('projects').find({}).toArray(function(err,projects){
      if (err) throw err;
      db.close();
      res.render('listprojects',{layout:'dashboardlayout',projects:projects})
    })
  })
});
//--------

//create a project

router.get('/new',function(req,res,next){
  res.render('createproject',{layout:'dashboardlayout'})
})

//---------
//backend for creating the project
router.post('/new',function(req,res,next){
  let title=req.body.title;
  let image=req.body.image;
  let description=req.body.description;
  let project={title,image,description};

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('projects').insertOne(project, function (err, projects) {
      if (err) throw err;
      db.close();
      res.redirect('/projects')
    })
  });

})
//----------


// clicking on a project and get delails in labels
router.get("/projects/:id", function (req, res,next) {
  let id = req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('projects').findOne({ _id: new ObjectId(id) }, function (err, projects) {
      if (err) throw err;
      db.close();
      res.render('projectdetail', {layout:'dashboardlayout', projects: projects })
    })
  });
})
//---------

//backend for when update button is pressed
router.post("/projects/:id",function(req,res,next){
  let id = req.params.id;
  let title=req.body.title;
  let image=req.body.image;
  let description=req.body.description;
  let project={title,image,description}
  let updatedproject={$set:project};

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('projects').updateOne({ _id: new ObjectId(id) },updatedproject, function (err, p) {
      if (err) throw err;
      db.close();
      res.render('projectdetail', {layout:'dashboardlayout', project: project ,success:true})
    })
  });

})

//-------

//delete the projects (one)
router.get('/projects/:id/delete',function(req,res,next){
  let id=req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('projects').deleteOne({ _id: new ObjectId(id) }, function (err, p) {
      if (err) throw err;
      db.close();
     res.redirect('/projects')
    })
  });
})

//----------

// list of blogs
router.get("/blog", function (req, res, next) {
  // Get data from MongoDB
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project1");
    dbo.collection("blogs").find({}).toArray(function (err, blogs) {
      if (err) throw err;
      db.close();
      res.render("blogs", {layout:'dashboardlayout',blogs: blogs });
    });
  });
});
//-----------

//create a new blog
router.get('/newblog',function(req,res,next){
  res.render('createblog',{layout:'dashboardlayout'})
})

//---------

//backend for creating a blog
router.post('/newblog',function(req,res,next){
  let nametwo=req.body.nametwo;
  let imagetwo=req.body.imagetwo;
  let paratwo=req.body.paratwo;
  let blog={nametwo,imagetwo,paratwo}

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('blogs').insertOne(blog, function (err, blog) {
      if (err) throw err;
      db.close();
      res.redirect('/blog')
    })
  });
})
//----------

// clicking on a blog and get delails in labels
router.get("/blogs/:id", function (req, res,next) {
  let id = req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('blogs').findOne({ _id: new ObjectId(id) }, function (err, blogs) {
      if (err) throw err;
      db.close();
      res.render('blogdetail', {layout:'dashboardlayout', blogs: blogs })
    })
  });
})
//---------


//backend for when edit complete and button pressed
router.post("/blogs/:id",function(req,res,next){
  let id = req.params.id;
  let nametwo=req.body.nametwo;
  let imagetwo=req.body.imagetwo;
  let paratwo=req.body.paratwo;
  let blog={nametwo,imagetwo,paratwo}
  let updatedblog={$set:blog};

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('blogs').updateOne({ _id: new ObjectId(id) },updatedblog, function (err, p) {
      if (err) throw err;
      db.close();
      res.render('blogdetail', {layout:'dashboardlayout', blog: blog ,success:true})
    })
  });
})

//-----------

//delete a blog (one)
router.get('/blogs/:id/delete',function(req,res,next){
  let id=req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('blogs').deleteOne({ _id: new ObjectId(id) }, function (err, p) {
      if (err) throw err;
      db.close();
     res.redirect('/blog')
    })
  });
})

//----------

// list of people for contact
router.get("/contact", function (req, res, next) {
  // Get data from MongoDB
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project1");
    dbo.collection("persons").find({}).toArray(function (err, contact) {
      if (err) throw err;
      db.close();
      res.render("contact", {layout:'dashboardlayout',contact: contact });
    });
  });
});
//-----------
//delete of contacts
router.get('/contact/:id/delete',function(req,res,next){
  let id=req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('persons').deleteOne({ _id: new ObjectId(id) }, function (err, m) {
      if (err) throw err;
      db.close();
     res.redirect('/contact')
    })
  });
})


//---------------


// list of people for Newsletter
router.get("/newsletter", function (req, res, next) {
  // Get data from MongoDB
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project1");
    dbo.collection("newsletter").find({}).toArray(function (err, newsletter) {
      if (err) throw err;
      db.close();
      res.render("newsletter", {layout:'dashboardlayout',newsletters: newsletter });
    });
  });
});
//-----------

// delete for subscribers
router.get('/newsletter/:id/delete',function(req,res,next){
  let id=req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('newsletter').deleteOne({ _id: new ObjectId(id) }, function (err, m) {
      if (err) throw err;
      db.close();
     res.redirect('/newsletter')
    })
  });
})
//------------


//logout
router.get('/logout', function (req, res, next) {
  req.session.isLoggedIn=false
  delete req.session.user;
  res.redirect('/signin')
})
//--------

module.exports = router;
