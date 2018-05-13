module.exports = function(router) {
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
    // 기본화면설정
    commonpage('about');
    commonpage('blog');
    commonpage('blog-detail');
    commonpage('contact');

    //index화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');
        var database = req.app.get('database');
        database.GoodsModel.find().exec(function (err, results) {
            var itemcount = results.length;
            // 인증 안된 경우
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.render('index.ejs', {login_success: false, itemcount: itemcount, goods: results});
            } else {
                console.log('사용자 인증된 상태임.');
                res.render('index.ejs', {
                    login_success: true,
                    user: req.user,
                    itemcount: itemcount,
                    goods: results
                });
            }
        });
    });

    router.route('/product-detail').get(function(req, res) {
        console.log('/product-detail 패스 요청됨.');
        var paramId = req.query.pd_id;
        var database = req.app.get('database');
        database.GoodsModel.findOne({'pd_id':paramId}, function (err, results) {
            // 인증 안된 경우
            if(err) console.log(err);
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.render('product-detail.ejs', {login_success: false, goods: results});
            } else {
                console.log('사용자 인증된 상태임.');
                res.render('product-detail.ejs', {login_success: true, user: req.user, goods: results});
            }
        });
    });
    router.route('/product').get(function(req, res) {
        console.log('/product 패스 요청됨.');
        var database = req.app.get('database');
        var pagecount = req.query.page-1;
        var category = req.query.category;
        if(category==undefined) {
            category = '';
            database.GoodsModel.find().exec(function (err, results) {
                var itemcount = results.length;
                var totalcount = itemcount / 9;
                if (pagecount > totalcount || isNaN(pagecount)) pagecount = 0;
                // 인증 안된 경우
                if (!req.user) {
                    console.log('사용자 인증 안된 상태임.');
                    res.render('product.ejs', {
                        login_success: false,
                        itemcount: itemcount,
                        goods: results,
                        pagecount: pagecount,
                        totalcount: totalcount,
                        category: category
                    });
                } else {
                    console.log('사용자 인증된 상태임.');
                    res.render('product.ejs', {
                        login_success: true,
                        user: req.user,
                        itemcount: itemcount,
                        goods: results,
                        pagecount: pagecount,
                        totalcount: totalcount,
                        category: category
                    });
                }

            });
        } else{
            database.GoodsModel.find({'pd_category1': category}).exec(function (err, results) {
                var itemcount = results.length;
                var totalcount = itemcount / 9;
                if (pagecount > totalcount || isNaN(pagecount)) pagecount = 0;
                // 인증 안된 경우
                if (!req.user) {
                    console.log('사용자 인증 안된 상태임.');
                    res.render('product.ejs', {
                        login_success: false,
                        itemcount: itemcount,
                        goods: results,
                        pagecount: pagecount,
                        totalcount: totalcount,
                        category: category
                    });
                } else {
                    console.log('사용자 인증된 상태임.');
                    res.render('product.ejs', {
                        login_success: true,
                        user: req.user,
                        itemcount: itemcount,
                        goods: results,
                        pagecount: pagecount,
                        totalcount: totalcount,
                        category: category
                    });
                }

            });
        }
    });

    router.route('/addcart').get(function(req, res) {
        console.log('/addcart 패스 요청됨.');
        var paramId = req.query.pd_id;
        var paramNum = req.query.pd_num;
        var paramName = '';
        var paramPrice = 0;
        var database = req.app.get('database');
        if(paramNum==undefined) paramNum=1;

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.write('<script type="text/javascript">alert("Please Sign In!");window.location="/login";</script>');
        }
        else {
            database.GoodsModel.findOne({'pd_id':paramId}, function(err, goods){
                paramName = goods.pd_name;
                paramPrice = goods.pd_price;
                database.UserModel.findOneAndUpdate({'email' :  req.user.email, "cart.cart_id":paramId}, {$inc:{'cart.$.cart_num':paramNum}}, {new: true}, function(err, user_e) {
                    if(user_e){
                        console.log('카트 있음');
                        req.session.regenerate(function (err) {
                            req.logIn(user_e, function (error) {
                                req.session.save(function (err) {
                                    res.end();
                                });
                            });
                        });
                    }
                    else{
                        console.log('카트 없음');
                        database.UserModel.findOneAndUpdate({'email' :  req.user.email}, {$push : {'cart':{'cart_id': paramId, 'cart_num': paramNum, 'cart_name': paramName, 'cart_price': paramPrice}}}, {new: true}, function(err, user_e){
                            req.session.regenerate(function(err){
                                req.logIn(user_e, function(error) {
                                    req.session.save(function (err) {
                                        res.end();
                                    });
                                });
                            });
                        });
                    }
                });
            });
        }
    });

    router.route('/delcart').get(function(req, res) {
        console.log('/delcart 패스 요청됨.');
        var paramId = req.query.pd_id;
        var database = req.app.get('database');
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.write('<script type="text/javascript">alert("Please Sign In!");window.location="/login";</script>');
        }
        else {
            database.UserModel.findOneAndUpdate({'email' :  req.user.email, "cart.cart_id":paramId}, {$pull : {'cart':{'cart_id': paramId}}}, {new: true}, function(err, user_e){
                console.log('카트 있음');
                req.session.regenerate(function(err){
                    req.logIn(user_e, function(error) {
                        req.session.save(function (err) {
                            res.end();
                        });
                    });
                });
            });
        }
    });

    router.route('/cart').get(function(req, res) {
        console.log('/cart 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('cart.ejs', {login_success:true, user: req.user});
        }
    });

};