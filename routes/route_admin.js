module.exports = function(router) {
    var fs = require('fs');
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
        }
    });
    var upload = multer({
        storage: storage
    });
    router.route('/administrator').get(function(req, res) {
        console.log('/administrator 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            if(!req.user.auth==0){
                console.log('관리자 아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                res.render('administrator.ejs', {login_success:true, user: req.user});
            }
        }
    });

    router.route('/shipping').get(function(req, res) {
        console.log('/shipping 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            if(!req.user.auth==0){
                console.log('관리자 아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                var database = req.app.get('database');
                database.ShippingfeeModel.find().exec(function (err, results) {
                    res.render('shipping.ejs', {login_success: true, user: req.user, shipping:results});
                });
            }
        }
    });

    router.route('/shipping').post(function(req, res) {
        upload.single('method_file')(req, res, function(err) {
            if(err) console.log(err);
            var addcountry = require('../database/addcountry');
            console.log('/shipping 패스 요청됨.');
            // 인증 안된 경우
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.redirect('/');
            } else {
                addcountry.set(req.file.filename.slice(0, -5), function(result){
                    if (!req.user.auth == 0) {
                        console.log('관리자 아님');
                        res.redirect('/');
                    }
                    else {
                        console.log('사용자 인증된 상태임.');
                        var database = req.app.get('database');
                        var newmethod = new database.ShippingfeeModel({
                            'method_name': req.file.filename.slice(0, -5),
                            'created_by': req.user.name,
                            'method_detail': result
                        });
                        newmethod.save(function (err) {
                            if (err) console.log(err);
                            res.redirect('/shipping');
                        });
                    }
                });
            }
        });
    });

    router.route('/delshipping').post(function(req, res) {
        console.log('/shipping 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            if(!req.user.auth==0){
                console.log('관리자 아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                var database = req.app.get('database');
                database.ShippingfeeModel.find({'method_name' :  req.body.method_name}).remove(function(err){
                    if(err) console.log(err);
                    res.redirect('/shipping');
                });
            }
        }
    });

};