/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */

module.exports = function(router, passport) {
    function commonpage(pagename) {
        router.route('/'+pagename).get(function(req, res) {
            console.log('/'+pagename+' 패스 요청됨.');

            // 인증 안된 경우
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.render(pagename+'.ejs', {login_success:false});
            } else {
                console.log('사용자 인증된 상태임.');
                if (Array.isArray(req.user)) {
                    res.render(pagename+'.ejs', {login_success:true, user: req.user[0]._doc});
                } else {
                    res.render(pagename+'.ejs', {login_success:true, user: req.user});
                }
            }
        });
    }

    console.log('user_passport 호출됨.');

    // 기본화면설정
    commonpage('about');
    commonpage('blog');
    commonpage('blog-detail');
    commonpage('cart');
    commonpage('contact');
    commonpage('product');
    commonpage('product-detail');

    //index화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            if (Array.isArray(req.user)) {
                res.render('index.ejs', {login_success:true, user: req.user[0]._doc});
            } else {
                res.render('index.ejs', {login_success:true, user: req.user});
            }
        }
    });
    
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
            //console.dir(req.user);
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

    //관리자페이지
    router.route('/administrator').get(function(req, res) {
        console.log('/administrator 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            if(req.user.auth !== 0){
                console.log('관리자아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                if (Array.isArray(req.user)) {
                    res.render('administrator.ejs', {login_success:true, user: req.user[0]._doc});
                } else {
                    res.render('administrator.ejs', {login_success:true, user: req.user});
                }
            }
        }
    });

    router.route('/register').get(function(req, res) {
        console.log('/register 패스 요청됨.');
        var category = ["SNSD", "Twice", "Girlsday"];
        var ct_1 = ["Taeyeon", "Yoona", "Sunny"];
        var ct_2 = ["MOMO", "Dahyeon", "Nayeon"];
        var ct_3 = ["SoJIn", "Yoora", "MinA"];
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            if(req.user.auth !== 0){
                console.log('관리자아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                if (Array.isArray(req.user)) {
                    res.render('register.ejs', {login_success:true, user: req.user[0]._doc, category:category, ct_1:ct_1, ct_2:ct_2, ct_3:ct_3});
                } else {
                    res.render('register.ejs', {login_success:true, user: req.user, category:category, ct_1:ct_1, ct_2:ct_2, ct_3:ct_3});
                }
            }
        }
    });
    
//---------------------------------------------------------------------

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
        var paramAddress = req.body.address || req.query.address;
        var paramAddress2 = req.body.address2 || req.query.address2;
        var paramCity = req.body.city || req.query.city;
        var paramState = req.body.state || req.query.state;
        var paramZip = req.body.zip || req.query.zip;
        var paramCountry = req.body.country || req.query.country;
        var paramCellnum = req.body.cellnum || req.query.cellnum;
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
                res.redirect('/welcome');
            }
            else{
                console.log('user없음')
                res.redirect('/');
            }
        });
    });

    router.route('/signup_tw').post(function(req, res){
        var paramAddress = req.body.address || req.query.address;
        var paramAddress2 = req.body.address2 || req.query.address2;
        var paramCity = req.body.city || req.query.city;
        var paramState = req.body.state || req.query.state;
        var paramZip = req.body.zip || req.query.zip;
        var paramCountry = req.body.country || req.query.country;
        var paramCellnum = req.body.cellnum || req.query.cellnum;
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
                res.redirect('/welcome');
            }
            else{
                console.log('user없음')
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
        var paramAddress = req.body.address || req.query.address;
        var paramAddress2 = req.body.address2 || req.query.address2;
        var paramCity = req.body.city || req.query.city;
        var paramState = req.body.state || req.query.state;
        var paramZip = req.body.zip || req.query.zip;
        var paramCountry = req.body.country || req.query.country;
        var paramCellnum = req.body.cellnum || req.query.cellnum;
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

    router.route('/auth/twitter').get(passport.authenticate('twitter', {
        scope : 'email'
    }));

    // 패스포트 - 페이스북 인증 콜백 라우팅
    router.route('/auth/twitter/callback').get(passport.authenticate('twitter', {
        successRedirect : '/signup_tw',
        failureRedirect : '/login'
    }));

    //상품DB저장
    router.route('/register').post(function(req, res){
        var paramPD_id = 1;
        var paramPD_name = req.body.pd_name || req.query.pd_name;
        var paramPD_price = req.body.pd_price || req.query.pd_price;
        var paramPD_cate1 = req.body.pd_ct1|| req.query.pd_ct1;
        var paramPD_cate2 = req.body.pd_ct2 || req.query.pd_ct2;
        var paramPD_rel1 = req.body.pd_rel1 || req.query.pd_rel1;
        var paramPD_rel2 = req.body.pd_rel2 || req.query.pd_rel2;
        var paramPD_rel3 = req.body.pd_rel3 || req.query.pd_rel3;
        var paramPD_detail = req.body.pd_detail || req.query.pd_detail;
        var paramPD_des = req.body.pd_des || req.query.pd_des;
        var paramPD_addin = req.body.pd_addin || req.query.pd_addin;
        var database = req.app.get('database');

        database.GoodsModel.findOne({ 'pd_name' :  paramPD_name }, function(err, goods) {
            // 에러 발생 시
            if (err) {
                return done(err);
            }

            // 기존에 사용자 정보가 있는 경우
            if (goods) {
                console.log('기존에 상품이 있음');
                res.redirect('/register');
            }
            else {
                // 모델 인스턴스 객체 만들어 저장
                var newgoods = new database.GoodsModel({'pd_id':paramPD_id, 'pd_name':paramPD_name, 'pd_price':paramPD_price,
                    'pd_category1':paramPD_cate1, 'pd_category2':paramPD_cate2, 'pd_relatedpd1':paramPD_rel1,
                    'pd_relatedpd2':paramPD_rel2, 'pd_realtedpd3':paramPD_rel3, 'pd_detail':paramPD_detail,
                    'pd_description':paramPD_des, 'pd_additionalinfo':paramPD_addin});
                newgoods.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log("사용자 데이터 추가함.");
                    res.redirect('/register');
                });
            }
        });
    });
};