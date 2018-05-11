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
    commonpage('cart');
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
        if(isNaN(category)) category= 0;
        database.GoodsModel.find().exec(function (err, results) {
            var itemcount = results.length;
            var totalcount = itemcount/9;
            if(pagecount>totalcount || isNaN(pagecount)) pagecount = 0;
            // 인증 안된 경우
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.render('product.ejs', {login_success: false, itemcount:itemcount, goods:results, pagecount:pagecount, totalcount:totalcount, category:category});
            } else {
                console.log('사용자 인증된 상태임.');
                res.render('product.ejs', {login_success: true, user: req.user, itemcount:itemcount, goods:results, pagecount:pagecount, totalcount:totalcount, category:category});
            }
        });
    });
};