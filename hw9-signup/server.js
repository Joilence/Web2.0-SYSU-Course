var http = require('http');
var url = require('url');
var router = require("./router");

function launch() {
    http.createServer(onRequest).listen(8000);
    console.log("Server running at localhost:8000");
}

function onRequest(request, response) {
    var postData = "";
    request.on("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    request.on("end", function () {
        if (postData) console.log("(Server): Reveived Post data '" + postData + "'");
        router.route(url.parse(request.url).pathname, url.parse(request.url).query, response, postData);
    });
}

exports.launch = launch;