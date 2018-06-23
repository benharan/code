var express = require("express"),
    app = express(),
    sendIndex = function(req, res) {
        res.sendFile(__dirname + '/index.html')
    };

/* Serve static files */
app.get(/^\/(scripts|style)(.+)$/, function(req, res){
    res.sendFile( __dirname + '/' + req.params[0] + req.params[1]);
});


/* Only serve main page */
app.get('/*', sendIndex);

var port = 8888;
app.listen(port, function() {
    console.log("Server Running - Listening on " + port);
});
