var express = require("express"),
    app = express(),
    sendIndex = function(req, res) {
        res.sendfile('index.html')
    };

/* serves all the static files */
app.get(/^\/(scripts|style)(.+)$/, function(req, res){
    console.log('static file request : ', req.params);
    res.sendfile( __dirname + '/' + req.params[0] + req.params[1]);
});

/* serves main page */
app.get('/', sendIndex);
app.get('/news/', sendIndex);
app.get('/news/*', sendIndex);


var port = 8888;
app.listen(port, function() {
    console.log("Express Server Listening on " + port);
});