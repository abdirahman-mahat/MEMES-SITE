var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');

var session;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(sessions({
  secret: 'dkjdk',
  resave: false,
  saveUninitialized: true
}))

app.get('/login', function(req, resp){

  session = req.session;
  if(session.uniqueID){
    resp.redirect('/redirects');
  }
  resp.sendFile('./login.html', {root: __dirname});
});

app.post('/login', function(req, resp){
  session = req.session;
  if(session.uniqueID){
    resp.redirect('/redirects');
  }

//  if (req.body.username == 'admin' && req.body.password == 'admin') {
    session.uniqueID = req.body.username;
//  }
  resp.redirect('/redirects')
});

app.get('/logout', function(req, resp){
  req.session.destroy();
  resp.redirect("/login")
});

app.get('/admin', function(req, resp){
  resp.sendFile(__dirname + '/index.html');
})


app.get('/redirects', function(req, resp){
  session = req.session;
  if (session.uniqueID == 'admin') {
    console.log(session.uniqueID);
    resp.redirect('/admin');
  }else {
    resp.send(req.session.uniqueID + ' not found <a href="/logout">KILL SESSION</a>');
  }
})

app.listen(1337, function(){
  console.log('Listening at Port 1337');
});
