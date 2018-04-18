var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.route('/process/login').post(function(req, res) {
    console.log('/process/login 호출됨.');

    // 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
    if (database) {
        database.authUser(database, paramId, paramPassword, function(err, docs) {
            // 에러 발생 시, 클라이언트로 에러 전송
            if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Error Occured While Logging In</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            // 조회된 레코드가 있으면 성공 응답 전송
            if (docs) {
                console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
                var username = docs[0].name;

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>Logged In!</h1>');
                res.write('<div><p>User Id : ' + paramId + '</p></div>');
                res.write('<div><p>User Name: ' + username + '</p></div>');
                res.write("<br><br><a href='../index.html'>Main Page</a>");
                res.end();

            } else {  // 조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>Login Failed</h1>');
                res.write('<div><p>Invalid ID or Password</p></div>');
                res.write("<br><br><a href='../adduser.html'>Sign Up</a>");
                res.write("<br><br><a href='../login.html'>Click here to login again.</a>");
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Database Connection Failure</h2>');
        res.write('<div><p>Failed to connect Database.</p></div>');
        res.end();
    }

});

module.exports = router;
