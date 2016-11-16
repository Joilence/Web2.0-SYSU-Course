var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var dataBase = require('./dataBase.js');

var signinPage = "/signin.html";
var detailPage = "/detail.html";

var MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
}

var checkCase = {
    name: /^[a-z]\w{5,17}$/i,
    id: /^[1-9]\d{7}$/,
    tel: /^[1-9]\d{10}$/,
    email: /^[a-z0-9]([\-_\.]?[a-z0-9]+)*@([a-z0-9_\-]+\.)+[a-zA-Z]{2,4}$/i
}

var handleRequest = {
    '/signup': signup,
    '/': signin,
    '/dataCheck': dataCheck,
    '/getFile': getFile
};

function route(pathname, query, response, postData) {
    var userName = querystring.parse(query)["username"];
    if (userName) {
        showDetail(pathname, query, response, postData, userName);
    } else if (handleRequest[pathname]) {
        handleRequest[pathname](pathname, query, response, postData);
    } else {
        handleRequest['/getFile'](pathname, query, response, postData);
    }
}

function dataCheck(pathname, query, response, postData) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    var data = querystring.parse(postData);
    for (var item in data) {
        dataBase.query(item, data[item], function (rows) {
            if (rows[0]) {
                response.end("'" + data[item] + "' is already taken");
            } else {
                response.end();
            }
        })
    }
}

function getFile(pathname, query, response, postData) {
    fs.readFile("public" + pathname, "binary", function (err, file) {
        if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end(err);
        } else {
            response.writeHead(200, { 'Content-Type': MIME[path.extname(pathname)] });
            response.write(file, "binary");
            response.end();
        }
    });
}

function checkUser(user, callback) {
    for (var i in user) {
        if (!checkCase[i].test(user[i])) {
            callback(false);
            return;
        }
    }
    dataBase.checkUser(user, function (rows) {
        callback(!rows[0]);
    });
}

function signup(pathname, query, response, postData) {
    var user = querystring.parse(postData);
    delete user.submit;
    checkUser(user, function (pass) {
        if (pass) {
            console.log("(Router): Adding user '" + user.name + "' succeed.");
            dataBase.addUser(user, function (err, res) {
                if (err) console.log("Adding failed");
                else console.log("Adding succeed");
            });
            showDetail(pathname, query, response, postData, user.name);
        } else {
            console.log("(Router): Adding user '" + user.name + "' failed");
            getFile(signinPage, query, response, postData);
        }
    });
}

function signin(pathname, query, response, postData) {
    console.log("(Router): request for sign in");
    var userName = querystring.parse(query).username;
    if (userName) showDetail(pathname, query, response, postData, userName);
    else getFile(signinPage, query, response, postData);
}

function showDetail(pathname, query, response, postData, userName) {
    console.log("(Router): Showing detail for user '" + userName + "'");
    dataBase.query("name", userName, function (rows) {
        if (rows[0]) {
            var realPath = "public" + detailPage, user = rows[0];
            fs.readFile(realPath, "utf8", function (err, file) {
                response.writeHead(200, { 'Content-Type': MIME[path.extname(realPath)] });
                for (var i in user) {
                    file = file.replace('{{' + i + '}}', user[i]);
                }
                response.write(file, "utf8");
                response.end();
            });
        } else {
            getFile(signinPage, query, response, postData);
        }
    })
}

exports.route = route;