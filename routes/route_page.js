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
                var database = req.app.get('database');
                database.CartModel.find({'user_email':req.user.email}).exec(function(err, cart){
                    res.render(pagename+'.ejs', {login_success:true, user: req.user, cart:cart});
                });
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
                console.log(req.user);
                console.log('사용자 인증된 상태임.');
                database.CartModel.find({'user_email':req.user.email}).exec(function(err, cart){
                    res.render('index.ejs', {
                        login_success: true,
                        user: req.user,
                        itemcount: itemcount,
                        goods: results,
                        cart: cart
                    });
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
                database.CartModel.find({'user_email':req.user.email}).exec(function(err, cart){
                    res.render('product-detail.ejs', {login_success: true, user: req.user, goods: results, cart:cart});
                });
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
                    database.CartModel.find({'user_email':req.user.email}).exec(function(err, cart){
                        res.render('product.ejs', {
                            login_success: true,
                            user: req.user,
                            itemcount: itemcount,
                            goods: results,
                            pagecount: pagecount,
                            totalcount: totalcount,
                            category: category,
                            cart:cart
                        });
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
                    database.CartModel.find({'user_email':req.user.email}).exec(function(err, cart){
                        console.log('사용자 인증된 상태임.');
                        res.render('product.ejs', {
                            login_success: true,
                            user: req.user,
                            itemcount: itemcount,
                            goods: results,
                            pagecount: pagecount,
                            totalcount: totalcount,
                            category: category,
                            cart:cart
                        });
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
        var paramWeight = 0;
        var database = req.app.get('database');
        if(paramNum==undefined) paramNum=1;
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.write('<script type="text/javascript">alert("Please Sign In!");window.location="/login";</script>');
        }
        else {
            database.CartModel.find({'user_email':req.user.email, 'cart_id':paramId}).exec(function(err, cart){
               if(err) console.log(err);
               if(cart.length>0){
                   database.CartModel.update({'user_email':req.user.email, 'cart_id':paramId}, {$inc : {'cart_num':1}}, {new:true}, function(err){
                       if(err) console.log(err);
                       res.end();
                   })
               }
               else{
                   database.GoodsModel.findOne({'pd_id':paramId}, function(err, goods){
                       paramName = goods.pd_name;
                       paramPrice = goods.pd_price;
                       paramWeight = goods.pd_weight;
                       var newcart = new database.CartModel({
                           'user_email': req.user.email, 'cart_id': paramId, 'cart_num': paramNum, 'cart_name': paramName,
                           'cart_price': paramPrice, 'cart_weight': paramWeight
                       });
                       newcart.save(function(err){
                           if(err) console.log(err);
                           res.end();
                       });
                   });
               }
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
            database.CartModel.find({'user_email' :  req.user.email, "cart_id":paramId}).remove(function(err){
                if(err) console.log(err);
                console.log("카트 지워짐");
            });
        }
    });

    router.route('/cart').get(function(req, res) {
        console.log('/cart 패스 요청됨.');
        var database = req.app.get('database');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            database.CartModel.find({'user_email':req.user.email}).exec(function(err, cart){
                console.log('사용자 인증된 상태임.');
                res.render('cart.ejs', {login_success:true, user: req.user, cart:cart});
            });
        }
    });
};