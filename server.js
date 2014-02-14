/*
    Node.js server script
    Required node packages: express, redis, socket.io
*/
const PORT = 3000;
const HOST = 'localhost';

var express = require('express'),
    http = require('http'), 
    
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var app = express();
app.use('/', express.static(__dirname + '/'));

var server = http.createServer(app);

          



const redis = require('redis');
const client = redis.createClient(
  6379,
  "nodejitsudb4112456240.redis.irstack.com",
  {
    auth_pass:"nodejitsudb4112456240.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4"
  });
log('info', 'connected to redis server');

const io = require('socket.io');

if (!module.parent) {
    server.listen(PORT, HOST);
    const socket  = io.listen(server);

    socket.on('connection', function(client) {
        const subscribe = redis.createClient(
          6379,
          "nodejitsudb4112456240.redis.irstack.com",
          {
            auth_pass:"nodejitsudb4112456240.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4"
          });
        subscribe.subscribe('twitter_trend');

        subscribe.on("message", function(channel, message) {
            client.send(message);
            log('msg', "received from channel #" + channel + " : " + message);
        });

        client.on('message', function(msg) {
            log('debug', msg);
        });

        client.on('disconnect', function() {
            log('warn', 'disconnecting from redis');
            subscribe.quit();
        });
    });
}

function log(type, msg) {

    var color   = '\u001b[0m',
        reset = '\u001b[0m';

    switch(type) {
        case "info":
            color = '\u001b[36m';
            break;
        case "warn":
            color = '\u001b[33m';
            break;
        case "error":
            color = '\u001b[31m';
            break;
        case "msg":
            color = '\u001b[34m';
            break;
        default:
            color = '\u001b[0m'
    }

    console.log(color + '   ' + type + '  - ' + reset + msg);
}
