var express = require('express'); 
var fs = require('fs'); 
var app = express(); 
var path = require('path'); 
 
// Routes 
 
app.use(express.static('public')); 
 
app.get('/', function (request, response) {   
    fs.readFile('public/index.html', function (error,data) { 
        response.writeHead(200,{'content-type':'text/html'}); 
        response.end(data); 
    }); 
});
 
app.listen(3000);  