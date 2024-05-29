var express = require('express');
var router = express.Router();
const mainDo = require('../works/MainDo');

router.get('/', function(req, res, next) {
  let mess = mainDo.LoadMain(req.session.userid,req.session.token);
  if(mess.code==0){
    res.render("main",mess);
  }
  else{
    res.render('index');
  }
});

router.get('/admm', function(req, res, next) {
  let mess=mainDo.InitToAdm(req.session.mtoken);
  if(mess.ok){
    req.session.mtoken=mess.token;
    delete mess.token;
    res.render("adm",mess);
  }
  else{
    if(req.session.mtoken){
      res.send(req.session.mtoken);
    }
    else{
      req.session.mtoken=mess.num;
      res.send(mess.num);
    }
  }
});

router.post('/login', function (req,res,next) {
  let mess = mainDo.Login(req.body.id,req.body.ik);
  if(mess.code==0){
    req.session.userid=req.body.id;
    req.session.token=mess.token;
  }
  res.json(mess);
});

router.post('/MMSauth', function (req,res,next) {
  res.json(mainDo.MMSAuth(req.body.id,req.body.pass,req.body.auth));
});

router.post('/Stuinsert', function (req,res,next) {
  res.json(mainDo.MMSinsertstu(req.session.mtoken,req.body.result));
});

router.post('/Sturemove', function (req,res,next) {
  res.json(mainDo.MMSremovestu(req.session.mtoken,req.body.result));
});

router.post('/Sseturl', function (req,res,next) {
  res.json(mainDo.MMSseturl(req.session.mtoken,req.body.url,req.body.txt));
});

router.post('/Sopen', function (req,res,next) {
  res.json(mainDo.MMSopen(req.session.mtoken));
});

router.post('/Ssettype', function (req,res,next) {
  res.json(mainDo.MMSsettype(req.session.mtoken,req.body.id));
});

router.post('/Supscore', function (req,res,next) {
  res.json(mainDo.MMSupscore(req.session.mtoken,req.body.score));
});

router.post('/startaudio', function(req, res, next) {
  res.json(mainDo.StartAudio(req.session.userid,req.session.token));
});

router.post('/loadsave', function(req, res, next) {
  res.json(mainDo.LoadSave(req.session.userid,req.session.token,req.body.txt,req.body.process));
});
router.post('/submitscore', function(req, res, next) {
  res.json(mainDo.Score(req.session.userid,req.session.token,req.body.txt,req.body.process));
});
router.post('/mmsinfo', function(req, res, next) {
  res.json(mainDo.MMSinfook(req.session.mtoken));
});

router.post('/MMSsettype_m', function (req,res,next) {
  res.json(mainDo.MMSsettype_M(req.body.id,req.body.pass,req.body.auth));
});

router.post('/MMSopen_m', function (req,res,next) {
  res.json(mainDo.MMSopen_M(req.body.pass,req.body.auth));
});

module.exports = router;
