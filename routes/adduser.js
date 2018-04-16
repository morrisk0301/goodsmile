var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.route('/process/adduser').post(function(req, res) {
    console.log('/process/adduser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramEmail = req.body.email || req.query.email;
    var paramAddress = req.body.address || req.query.address;
    var paramAuth = 1;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName+ ', ' + paramEmail+ ', ' + paramAddress);

    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
    if (database) {
        database.addUser(database, paramId, paramPassword, paramName,  paramEmail, paramAddress, paramAuth, function(err, addedUser) {
            if (err) {throw err;}

            // 결과 객체 있으면 성공 응답 전송
            if (addedUser) {
                console.dir(addedUser);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>User Added</h2>');
                res.write("<br><br><a href='../index.html'>Main Page</a>");
                res.end();
            } else {  // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Failed to add User</h2>');
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Database Connection Failure</h2>');
        res.end();
    }

});

module.exports = router;