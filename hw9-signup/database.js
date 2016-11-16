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
        console.error('Error: fail to connect database: ' + err.stack);
        return;
    }
    console.log('Database connected as id ' + conn.threadId);
});

function addUser(user, fn) {
    console.log("(Database): Succeed to add user.");
    console.log(user);
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

exports.addUser = addUser;
exports.checkUser = checkUser;
exports.query = query;



