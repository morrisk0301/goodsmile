/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */

module.exports = function(router, passport) {

    console.log('route_user 호출됨.');

    // 로그인 화면
    router.route('/login').get(function(req, res) {
        console.log('/login 패스 요청됨.');
        res.render('login.ejs', {login_success:false, message: req.flash('loginMessage')});
    });
	 
    // 회원가입 화면
    router.route('/signup').get(function(req, res) {
        if (req.user) {
            console.log('로그인 상태임');
            res.redirect('/');
        }
        else{
            console.log('/signup 패스 요청됨.');
            res.render('signup.ejs', {login_success:false, message: req.flash('signupMessage')});
        }
    });

    // 페이스북 회원가입
    router.route('/signup_fb').get(function(req, res) {
        console.log('/signup_fb 패스 요청됨.');

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } 
        else if (req.user.address !== '' && req.user.address !== null) {
            console.log('페이스북 회원가입 완료');
            res.redirect('/');
        }
        else {
            console.log('사용자 인증된 상태임.');
            //console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('signup_fb.ejs', {login_success:true, user: req.user[0]._doc});
            } else {
                res.render('signup_fb.ejs', {login_success:true, user: req.user});
            }
        }
    });

    //Twitter 회원가입
    router.route('/signup_tw').get(function(req, res) {
        console.log('/signup_tw 패스 요청됨.');

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        }
        else if (req.user.address !== '' && req.user.address !== null) {
            console.log('트위터 회원가입 완료');
            res.redirect('/');
        }
        else {
            console.log('사용자 인증된 상태임.');
            //console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('signup_tw.ejs', {login_success:true, user: req.user[0]._doc});
            } else {
                res.render('signup_tw.ejs', {login_success:true, user: req.user});
            }
        }
    });
	 
    // 프로필 화면
    router.route('/profile').get(function(req, res) {
        console.log('/profile 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile 패스 요청됨.');
            //console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {login_success:true, user: req.user[0]._doc});
            } else {
                res.render('profile.ejs', {login_success:true, user: req.user});
            }
        }
    });

    //Welcome 화면
    router.route('/welcome').get(function(req, res) {
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/welcome 패스 요청됨.');
            var name = req.user.name;
            req.logout();
            res.render('welcome.ejs', {login_success:false, username:name});
        }
    });

    //프로필수정 완료 화면
    router.route('/profile_re').get(function(req, res) {
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile_re 패스 요청됨.');
            var name = req.user.name;
            req.logout();
            res.render('profile_re.ejs', {login_success:false, username:name});
        }
    });

    //프로필수정1
    router.route('/profile_edit').get(function(req, res) {
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profileedit 패스 요청됨.');
            if (Array.isArray(req.user)) {
                res.render('profile_edit.ejs', {login_success:true, user: req.user[0]._doc});
            } else {
                res.render('profile_edit.ejs', {login_success:true, user: req.user});
            }
        }
    });

    //프로필수정2
    router.route('/profile_edit2').get(function(req, res) {
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profileedit2 패스 요청됨.');
            if (Array.isArray(req.user)) {
                res.render('profile_edit2.ejs', {login_success:true, user: req.user[0]._doc});
            } else {
                res.render('profile_edit2.ejs', {login_success:true, user: req.user});
            }
        }
    });
	
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });


    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/welcome',
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

    //페이스북 회원가입 인증

    router.route('/signup_fb').post(function(req, res){
        var paramAddress = req.body.address;
        var paramAddress2 = req.body.address2;
        var paramCity = req.body.city;
        var paramState = req.body.state;
        var paramZip = req.body.zip;
        var paramCountry = req.body.country;
        var paramCellnum = req.body.cellnum;
        var database = req.app.get('database');
        database.UserModel.findOneAndUpdate({ 'email' :  req.user.email }, { $set : {'address':paramAddress,
                    'address2':paramAddress2, 'city':paramCity, 'state':paramState, 'zip':paramZip,
                    'country':paramCountry, 'cellnum':paramCellnum}}, {new: true}, function (err, user){
            if(err){
                console.log(err);
                res.redirect('/');
            }
            if(user){
                console.log('user 있음');
                res.redirect('/welcome');
            }
            else{
                console.log('user없음');
                res.redirect('/');
            }
        });
    });

    //트위터 회원가입
    router.route('/signup_tw').post(function(req, res){
        var paramAddress = req.body.address;
        var paramAddress2 = req.body.address2;
        var paramCity = req.body.city;
        var paramState = req.body.state;
        var paramZip = req.body.zip;
        var paramCountry = req.body.country;
        var paramCellnum = req.body.cellnum;
        var database = req.app.get('database');
        database.UserModel.findOneAndUpdate({ 'email' :  req.user.email }, { $set : {'address':paramAddress,
                'address2':paramAddress2, 'city':paramCity, 'state':paramState, 'zip':paramZip,
                'country':paramCountry, 'cellnum':paramCellnum}}, {new: true}, function (err, user){
            if(err){
                console.log(err);
                res.redirect('/');
            }
            if(user){
                console.log('user 있음');
                res.redirect('/welcome');
            }
            else{
                console.log('user없음');
                res.redirect('/');
            }

        });

    });

    //프로필수정1
    router.route('/profile_edit').post(passport.authenticate('local-signup_re', {
        successRedirect : '/profile_re',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    //프로필수정2
    router.route('/profile_edit2').post(function(req, res){
        var paramAddress = req.body.address;
        var paramAddress2 = req.body.address2;
        var paramCity = req.body.city;
        var paramState = req.body.state;
        var paramZip = req.body.zip;
        var paramCountry = req.body.country;
        var paramCellnum = req.body.cellnum;
        var database = req.app.get('database');
        database.UserModel.findOneAndUpdate({ 'email' :  req.user.email }, { $set : {'address':paramAddress,
                'address2':paramAddress2, 'city':paramCity, 'state':paramState, 'zip':paramZip,
                'country':paramCountry, 'cellnum':paramCellnum}}, {new: true}, function (err, user){
            if(err){
                console.log(err);
                res.redirect('/');
            }
            if(user){
                console.log('user 있음')
                res.redirect('/profile_re');
            }
            else{
                console.log('user없음')
                res.redirect('/');
            }
        });
    });

    // 패스포트 - 페이스북 인증 라우팅 
    router.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope : 'email'
    }));

    // 패스포트 - 페이스북 인증 콜백 라우팅
    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect : '/signup_fb',
        failureRedirect : '/login'
    }));

    //패스포트 - 트위터
    router.route('/auth/twitter').get(passport.authenticate('twitter', {
        scope : 'email'
    }));

    // 패스포트 - 페이스북 인증 콜백 라우팅
    router.route('/auth/twitter/callback').get(passport.authenticate('twitter', {
        successRedirect : '/signup_tw',
        failureRedirect : '/login'
    }));
};