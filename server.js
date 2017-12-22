var express = require("express"),
    app = express(),
    sendIndex = function(req, res) {
        res.sendfile('index.html')
    };

/* Serve all the static files */
app.get(/^\/(scripts|style)(.+)$/, function(req, res){
    console.log(req.params, 'served');
    res.sendfile( __dirname + '/' + req.params[0] + req.params[1]);
});

/* Only serve main page */
app.get('/*', sendIndex);

var port = 8888;
app.listen(port, function() {
    console.log("Express Server Listening on " + port);
});
