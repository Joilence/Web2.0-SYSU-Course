/**
 * Created by jonypro on 14/11/2016.
 */

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: "123.207.116.226",
    user: "sysuweb",
    password: '1234abcd',
    database: 'sysuweb',
    port: 3306
});

conn.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + conn.threadId);
});

function showUser(fn) {
    conn.query('SELECT * FROM user', function (err, rows, fields) {
        fn(rows);
    });
}

function addUser(user, fn) {
    conn.query('INSERT INTO user (name, id, tel, email) values("' + user.name + '", "' + user.id + '", "' + user.tel + '", "' + user.email + '")', function (err, res) {
        fn(err, res);
    });
}

function checkUser(user, fn) {
    conn.query('SELECT * FROM user WHERE name="' + user.name + '" OR id="' + user.id + '" OR tel="' + user.tel + '" OR email="' + user.email + '"', function (err, rows, fields) {
        fn(rows);
    });
}

function query(item, value, fn) {
    conn.query('SELECT * FROM user WHERE ' + item + '="' + value + '"', function (err, rows, fields) {
        fn(rows);
    });
}

exports.showUser = showUser;
exports.addUser = addUser;
exports.checkUser = checkUser;
exports.query = query;


// var fs = require("fs");
//
// var databasePath = "database.json";
// var jsonStr = "";
// var jsonData = {{}};
//
// function syncFromFile() {
//     jsonStr = fs.readFile(databasePath, function (err, data) {
//         if (err) {
//             return console.log(err);
//         }
//         console.log("Async read jsonStr: " + data);
//     });
// }



