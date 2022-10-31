//start a server on port 8080
var http = require('http');
var fs = require('fs');
const e = require('express');
var server = http.createServer(function(req, res) {
    console.log('request was made: ' + req.url+" -- witch metode: "+req.method+" -- from ip: "+ req.connection.remoteAddress);
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile('webOs.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
} else if (req.url === '/background.js' && req.method === 'GET') {
    fs.readFile('background.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(data);
    });
} else if (req.url === '/display.js' && req.method === 'GET') {
    fs.readFile('display.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(data);
    });
}else if (req.url === '/webOs.css' && req.method === 'GET') {
    fs.readFile('webOs.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(data);
    });
} else if (req.url === '/api.js' && req.method === 'GET') {
    fs.readFile('api.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(data);
    });
}else {
    fs.readFile(req.url, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(data);
    });
}
}
);
server.listen(8080);