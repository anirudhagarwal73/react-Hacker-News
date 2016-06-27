var express=require('express');
var https=require('https');
var favicon = require('serve-favicon');
var app=express();

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon1.ico'));

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/views/index.html" );
});

app.get('/topstories', function (req, res) {
  https.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',function(response){
    response.setEncoding('utf8');
    response.on('error',console.error);
    response.on('data',function(data){
      res.send(data);
    });
  });
});

app.get('/newstories', function (req, res) {
  https.get('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty',function(response){
    response.setEncoding('utf8');
    response.on('error',console.error);
    response.on('data',function(data){
      res.send(data);
    });
  });
});

app.get('/beststories', function (req, res) {
  https.get('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty',function(response){
    response.setEncoding('utf8');
    response.on('error',console.error);
    response.on('data',function(data){
      res.send(data);
    });
  });
});

app.get('/showstories', function (req, res) {
  https.get('https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty',function(response){
    response.setEncoding('utf8');
    response.on('error',console.error);
    response.on('data',function(data){
      res.send(data);
    });
  });
});

app.get('/jobsstories', function (req, res) {
  https.get('https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty',function(response){
    response.setEncoding('utf8');
    response.on('error',console.error);
    response.on('data',function(data){
      res.send(data);
    });
  });
});

var server=app.listen(3000,function(){
  console.log("Up and Running ......");
});
