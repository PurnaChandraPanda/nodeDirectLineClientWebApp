global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');

var express = require('express');
var bodyParser = require('body-parser');
var directLine = require('botframework-directlinejs');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

// define routes
app.get('/', function (req, res) {
    // if send is with whole html tags
    //res.send('<html><body><h1>Hello World</h1></body></html>');

    // if send is for html file
    res.sendFile('index.html', {root: __dirname});
});
app.get('/dlClient', function (req, res) {
    res.sendFile('dlClient.html', {root: __dirname});
});
app.get('/webchatClient', function (req, res) {
    res.sendFile('simplewebchat.html', {root: __dirname});
});

app.post('/submit-student-data', function(req, res){
    var name = req.body.firstName + ' ' + req.body.lastName;
    res.send(name + ' - submitted successfully!');
});
app.post('/submit-data-dl', function(req, res){
    var query = req.body.inputQuery;

    // create a DirectLine object with secret
    var connector = new directLine.DirectLine({
        secret: 'your-drectline-secret-key'
    });

    // post activities to the bot
    connector.postActivity({
        from: {id: 'myUserId', name: 'myUserName'},
        type: 'message',
        text: query
    }).subscribe(
        id => console.log("Posted activity, assigned ID: ", id),
        error => console.log("Error posting activity:  ", error)
    );

    // listen to activities sent from the bot
    /*
    connector.activity$
        .subscribe(
            activity => console.log("received activity ", JSON.stringify(activity))
        );
    */

    // listen to all message activities
    /*
    connector.activity$
            .filter(activity => activity.type === 'message')
            .subscribe(
                message => console.log("received message ", JSON.stringify(message))
            );
    */
   
    // listen to received message actvities
    connector.activity$
        .filter(activity => activity.type === 'message' && activity.from.id === 'ipaddrchkbot')
        .subscribe(
            //message => console.log("received message ", JSON.stringify(message))
            message => {
                console.log("received message ", message.text);
            }
        );
    
    res.send(query + ' - submitted successfully!');
});

// get your server app ready on port# 5000
var server = app.listen(5000, function(){
    console.log('server is running ...');
});