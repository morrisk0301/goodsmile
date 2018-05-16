module.exports = function(router) {
    //order 화면
    router.route('/order').get(function(req, res) {
        console.log('/order 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('login.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('order.ejs', {login_success:true, user: req.user});
        }
    });
};