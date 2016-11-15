var http = require('http');
var url = require('url');
var router = require("./router");

function launch() {
    var route = router.route;
    function onRequest(request, response) {
        var postData = "";
        request.setEncoding("utf8");

        request.on("data", function (postDataChunk) {
            postData += postDataChunk;
        });
        request.on("end", function () {
            if (postData) console.log("Reveived Post data '" + postData + "'");
            console.log("Pathname: " + url.parse(request.url).pathname);
            console.log("Query: " + url.parse(request.url).query);
            // console.log(response);
            // console.log(postData);
            route(url.parse(request.url).pathname, url.parse(request.url).query, response, postData);
        });
    }

    http.createServer(onRequest).listen(8000);

    console.log("Server running at localhost:8000");
}

exports.launch = launch;