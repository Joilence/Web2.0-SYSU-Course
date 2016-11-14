/**
 * Created by jonypro on 14/11/2016.
 */

var querystring = require("querystring");
var fs = require("fs");
var path = require("path");
var database = require("./database");

var regexp = {
    name: /^[a-z]\w{5,17}$/i,
    id: /^[1-9]\d{7}$/,
    tel: /^[1-9]\d{10}$/,
    email: /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i
}

var signinPage = "/signin.html";
var detailPage = "/detail.html";

function dataCheck(pathname, query, response, postData) {
    console.log("checking data for '" + postData + "'");
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    var data = querystring.parse(postData);
    console.log("Data parsed: ", data);
    for (var i in data) {
        dataBase.query(i, data[i], function (rows) {
            if (rows[0]) {
                console.log("'" + data[i] + "' is already taken");
                response.end("'" + data[i] + "' is already taken");
            } else {
                response.end();
            }
        })
    }
}

var handle = {
    '/signup': signup,
    '/': signin,
    '/dataCheck': dataCheck,
    'getFile': getFile
};


function route() {

}



exports.route = route;