var express = require('express');
var router = express.Router();
var services=require('../src/services.js');
var multer  = require('multer');
var upload = multer({ dest: 'dataelements/' });                 
var rimraf = require("rimraf");
var common=require('../src/common.js');



// GET route for reading data
router.get('/', function (req, res, next) {
  res.render('index');
});

function checkUserAuth(req, res, next) {
  if(req.session.accessToken) {
    return next();
  }
  res.status(401);
  res.render('index',{'error':'User session expired!'});
}

//POST route for updating data
router.post('/', function (req, res, next) {
  if (req.body.company &&
    req.body.accessToken) {
  const auth = async () => {
    try {
      var company=await services.getCompanyDetails(req.body.company,req.body.accessToken);
      req.session.companyId = company.data.id;
      req.session.companyName=company.data.attributes.name;
      req.session.accessToken=req.body.accessToken;
      res.redirect('/home');
   }catch(err){
      console.error(err) 
       //return res.redirect('/profile');
      res.status(404);
      res.render('index',{'error':'Invalid Username Or Password!!!'});
    }
  }
    auth();
  
  }else {
    var err = new Error('All fields required.,,,,,,,,,,,,,,,,,,,,,,,');
    err.status = 400;
    return next(err);
  }
});
// GET route after registering
router.get('/home', checkUserAuth,function (req, res, next) {
 const getCompanies = async () => {
    try {
      var responseData=await services.getProperties(req);
      res.render('home', { company:{id:req.session.companyId,name:req.session.companyName},
                            properties: responseData.data});
   }catch(err){
    console.error(err) 
     res.render('home', { title: 'Errorrrrrrrrr' });
    }
  }
  getCompanies();
});
// GET route after registering
router.get('/dataelement',checkUserAuth, function (req, res, next) {
  res.render('dataelement', { company:{id:req.session.companyId,name:req.session.companyName},
                            properties: 'data'});
});

router.post('/uploads',checkUserAuth, upload.array('dataelements', 12), function (req, res, next) {

const auth = async () => {
    try {
      var company=await connector.createDataElements(req.body.company,req.body.accessToken);
      req.session.companyId = company.data.id;
      req.session.companyName=company.data.attributes.name;
      req.session.accessToken=req.body.accessToken;
      rimraf.sync("dataelements");

      res.render('dataelement', { company:{id:req.session.companyId,name:req.session.companyName},
                            properties: 'data'});

   }catch(err){
    console.error(err) 
       //return res.redirect('/profile');
      rimraf.sync("dataelements");

      res.status(500);
      res.render('dataelement', { company:{id:req.session.companyId,name:req.session.companyName},
                            properties: 'data'});

    }
  }
  auth();

});

module.exports = router;