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
app.use('/', express.static(__dirname + '/public'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));

var server = http.createServer(app);

          



const redis = require('redis');

// Nodejitsu redis server
// const client = redis.createClient(
//   6379,
//   "nodejitsudb4112456240.redis.irstack.com",
//   {
//     auth_pass:"nodejitsudb4112456240.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4"
//   });
// log('info', 'connected to redis server');

// Heroku redis to go server
// const client = redis.createClient(
//   9601,
//   "pearlfish.redistogo.com",
//   {
//     auth_pass:"eade05d17a0cd9d29fa5933894412ea7"
//   });
// log('info', 'connected to redis server');

// heroku redis cloud server
const client = redis.createClient(
  18039,
  "pub-redis-18039.us-east-1-4.2.ec2.garantiadata.com",
  {
    auth_pass:"oB7WsFKMNO2MNfzr"
  });

log('info', 'connected to redis server');



const io = require('socket.io');

if (!module.parent) {
    // local test
    // server.listen(PORT, HOST);

    // Heroku
    server.listen(process.env.PORT || PORT);

    const socket  = io.listen(server);

    socket.on('connection', function(client) {
        log('info', 'socket connected');

        //Nodejitsu redis server
        // const subscribe = redis.createClient(
        //   6379,
        //   "nodejitsudb4112456240.redis.irstack.com",
        //   {
        //     auth_pass:"nodejitsudb4112456240.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4"
        //   });
        // subscribe.subscribe('twitter_trend');

        //Heroku redis server
        // const subscribe = redis.createClient(
        //   9601,
        //   "pearlfish.redistogo.com",
        //   {
        //     auth_pass:"eade05d17a0cd9d29fa5933894412ea7"
        //   });
        

        // heroku redis cloud server
        const subscribe = redis.createClient(
          18039,
          "pub-redis-18039.us-east-1-4.2.ec2.garantiadata.com",
          {
            auth_pass:"oB7WsFKMNO2MNfzr"
          });

        subscribe.subscribe('twitter_trend');

        log('info', 'connected to redis server');

        subscribe.on("message", function(channel, message) {
            client.send(message);
            // log('msg', "received from channel #" + channel + " : " + message);
        });

        client.on('message', function(msg) {
            // log('debug', msg);
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
