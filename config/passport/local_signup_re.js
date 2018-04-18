/**
 * 패스포트 설정 파일
 * 
 * 로컬 인증방식에서 회원가입에 사용되는 패스포트 설정
 *
 * @date 2016-11-10
 * @author Mike
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true    // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, email, password, done) {
        // 요청 파라미터 중 name 파라미터 확인
        var paramName = req.body.name || req.query.name;
		var paramAddress = req.body.address || req.query.address;
    	var paramAddress2 = req.body.address2 || req.query.address2;
    	var paramCity = req.body.city || req.query.city;
		var paramState = req.body.state || req.query.state;
		var paramZip = req.body.zip || req.query.zip;
    	var paramCountry = req.body.country || req.query.country;
    	var paramCellnum = req.body.cellnum || req.query.cellnum;
	 
		console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);
		
	    // findOne 메소드가 blocking되지 않도록 하고 싶은 경우, async 방식으로 변경
	    process.nextTick(function() {
	    	var database = req.app.get('database');
		    database.UserModel.findOneAndUpdate({ 'email' :  email }, {$set: {'password':123, 'name':paramName,
                'address':paramAddress, 'address2':paramAddress2, 'city':paramCity, 'state':paramState,
                'zip':paramZip, 'country':paramCountry, 'cellnum':paramCellnum}},{new:true}, function(err, user) {
		        // 에러 발생 시
		        if (err) {
		            return done(err);
		        }
                return done(null, 1);
		    });
	    });

	});
