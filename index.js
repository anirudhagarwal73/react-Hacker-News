var express=require('express');
var https=require('https');
var concatStream = require('concat-stream');
var bodyParser = require('body-parser');
var app=express();
var favicon = require('serve-favicon');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
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


app.post('/loadStories',function(req,res){
  var results=[];
  var resultsCount=0;
  req.body.ids.forEach(function (id, i) {
    var url='https://hacker-news.firebaseio.com/v0/item/'+id+'.json?print=pretty';
    https.get(url, function (response) {
      response.setEncoding('utf8');
      response.pipe(concatStream(function (data) {
        results[i] = data;
        resultsCount++;
        if (resultsCount === req.body.ids.length) {
          res.send(results);
        }
      }));
    });
  });
});

var server=app.listen(3001,function(){
  console.log("Up and Running ......");
});
