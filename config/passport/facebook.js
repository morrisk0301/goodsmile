/**
 * 패스포트 설정 파일
 * 
 * 페이스북 인증 방식에 사용되는 패스포트 설정
 *
 * @date 2016-11-10
 * @author Mike
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		console.log('passport의 facebook 호출됨.');
		console.dir(profile);

        var modifiedemail;
		var database = app.get('database');
	    database.UserModel.findOne({'facebookid' : profile.id}, function (err, user) {
	    	console.log('user 확인');
	    	console.log(profile);
			if (err) return done(err);
			if (!user) {
				if (profile.emails == undefined) modifiedemail =  profile.id+'@id.com';
				else modifiedemail = profile.emails[0].value;
                console.log('email 확인');
				console.log(modifiedemail);
				var user = new database.UserModel({
					name: profile.displayName,
					email: modifiedemail,
					provider: 'facebook',
					authToken: accessToken,
					facebookid: profile.id,
				});
				user.save(function (err) {
					if (err) console.log(err);
					return done(err, user);
				});
			}
			else {
				return done(err, user);
			}
	    });
	});
};
