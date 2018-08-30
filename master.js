var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var path = require('path');

var session;

var app = express();

app.use('/assets/css', express.static('Footer-with-social-icons'));
app.use('/css', express.static('css'));


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

// var http = require('http');
// var formidable = require('formidable');
// var fs = require('fs');
//
// http.createServer(function(req, res){
//   if(req.url == '/fileupload'){
//     var form = new formidable.IncomingForm();
//     form.parse(req, function(err, fields, files){
//       var oldpath = files.filestoupload.path;
//       var newpath = '/home/abdulfatah' + files.filetoupload.name;
//       fs.rename(oldpath, newpath, function(err){
//         if(err) throw err;
//         res.write('File uploaded and moved!');
//         res.end();
//         });
//       });
//     }else{
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//   res.write('<input type="file" name="filetoupload"><br>');
//   res.write('<input type="submit">');
//   res.write('</form>');
//   return res.end();
//   }
// }).listen(8080);
