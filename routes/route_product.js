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
    var category = ["wannaone", "nuest", "twice", "gfriend", "momoland", "cheongha"];

    //관리자페이지
    router.route('/administrator').get(function(req, res) {
        console.log('/administrator 패스 요청됨.');
        var database = req.app.get('database');
        database.GoodsModel.find().exec(function (err, results) {
            var itemcount = results.length;

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
                        res.render('administrator.ejs', {login_success:true, user: req.user[0]._doc, itemcount:itemcount, goods:results});
                    } else {
                        res.render('administrator.ejs', {login_success:true, user: req.user, itemcount:itemcount, goods:results});
                    }
                }
            }
        });
    });

    router.route('/register').get(function(req, res) {
        console.log('/register 패스 요청됨.');

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
                var database = req.app.get('database');
                database.GoodsModel.find().exec(function (err, results) {
                    res.render('register.ejs', {login_success: true, user: req.user, category: category, goods:results});
                });
            }
        }
    });

    router.route('/register_view').get(function(req, res) {
        console.log('/register_view 패스 요청됨.');
        var paramName = req.query.pd_postname;
        var database = req.app.get('database');
        database.GoodsModel.findOne({'pd_name':paramName}, function (err, results) {

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
                        res.render('register_view.ejs', {login_success:true, user: req.user[0]._doc, goods:results});
                    } else {
                        res.render('register_view.ejs', {login_success:true, user: req.user, goods:results});
                    }
                }
            }
        });
    });

    router.get('/getimage/:pd_id/:pd_imgnum', function(req,res) {
        var database = req.app.get('database');
        var imgnum = req.params.pd_imgnum;
        database.GoodsModel.findOne({'pd_id':req.params.pd_id}, function(err,goods) {
            if(imgnum == 1){
                res.contentType(goods.pd_image1.contentType);
                res.send(goods.pd_image1.data);
            }
            else if(imgnum == 2){
                res.contentType(goods.pd_image2.contentType);
                res.send(goods.pd_image2.data);
            }
            else if(imgnum == 3){
                res.contentType(goods.pd_image3.contentType);
                res.send(goods.pd_image3.data);
            }
            else if(imgnum == 4){
                res.contentType(goods.pd_image4.contentType);
                res.send(goods.pd_image4.data);
            }
        });
    });

    router.route('/register_edit').get(function(req, res) {
        console.log('/register_edit 패스 요청됨.');
        var paramName = req.query.pd_postname;
        var database = req.app.get('database');

        database.GoodsModel.findOne({'pd_name':paramName}, function (err, results) {

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
                        res.render('register_edit.ejs', {login_success:true, user: req.user[0]._doc, goods:results, category:category});
                    } else {
                        res.render('register_edit.ejs', {login_success:true, user: req.user, goods:results, category:category});
                    }
                }
            }
        });
    });

    //상품DB저장
    router.route('/register').post(function(req, res){
        upload.array('pd_image', 4)(req, res, function(err){
            var paramImage = [null, null, null, null];
            var paramImageType = [null, null, null, null];
            var paramPD_viewPd = false;
            var paramPD_viewFPd = false;
            var paramPD_viewNew = false;
            var paramPD_viewSale = false;
            if(req.files.length!==0){
                for(var i=0;i<req.files.length;i++){
                    paramImage[i] = req.files[i].filename;
                    paramImageType[i] = req.files[i].mimetype;
                }
            }
            if(req.body.pd_viewPd!=undefined) paramPD_viewPd = true;
            if(req.body.pd_viewFPd!=undefined) paramPD_viewFPd = true;
            if(req.body.pd_viewNew!=undefined) paramPD_viewNew = true;
            if(req.body.pd_viewSale!=undefined) paramPD_viewSale = true;
            var paramPD_name = req.body.pd_name;
            var paramPD_price = req.body.pd_price;
            var paramPD_cate1 = req.body.pd_ct1;
            var paramPD_cate2 = req.body.pd_ct2;
            var paramPD_rel1 = req.body.pd_rel1;
            var paramPD_rel2 = req.body.pd_rel2;
            var paramPD_rel3 = req.body.pd_rel3;
            var paramPD_detail = req.body.pd_detail;
            var paramPD_des = req.body.pd_des;
            var paramPD_addin = req.body.pd_addin;
            var paramUser = req.user.name;
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
                    var newgoods = new database.GoodsModel({'pd_name':paramPD_name, 'pd_price':paramPD_price,
                        'pd_category1':paramPD_cate1, 'pd_category2':paramPD_cate2, 'pd_relatedpd1':paramPD_rel1,
                        'pd_relatedpd2':paramPD_rel2, 'pd_realtedpd3':paramPD_rel3, 'pd_detail':paramPD_detail,
                        'pd_description':paramPD_des, 'pd_additionalinfo':paramPD_addin, 'created_by':paramUser,
                        'pd_viewPd':paramPD_viewPd, 'pd_viewFPd':paramPD_viewFPd, 'pd_viewNew':paramPD_viewNew,
                        'pd_viewSale':paramPD_viewSale
                    });
                    for(var i=0;i<4;i++){
                        if(paramImage[i]==null){
                            if(i===0){
                                newgoods.pd_image1.data = fs.readFileSync('../public/images/default.jpg');
                                newgoods.pd_image1.contentType = "image/jpeg";
                            }
                            else if(i===1){
                                newgoods.pd_image2.data = fs.readFileSync('../public/images/default.jpg');
                                newgoods.pd_image2.contentType = "image/jpeg";
                            }
                            else if(i===2){
                                newgoods.pd_image3.data = fs.readFileSync('../public/images/default.jpg');
                                newgoods.pd_image3.contentType = "image/jpeg";
                            }
                            else if(i===3){
                                newgoods.pd_image4.data = fs.readFileSync('../public/images/default.jpg');
                                newgoods.pd_image4.contentType = "image/jpeg";
                            }
                        }
                        else{
                            if(i===0){
                                newgoods.pd_image1.data = fs.readFileSync('../uploads/'+paramImage[i]);
                                newgoods.pd_image1.contentType = paramImageType[i];
                            }
                            else if(i===1){
                                newgoods.pd_image2.data = fs.readFileSync('../uploads/'+paramImage[i]);
                                newgoods.pd_image2.contentType = paramImageType[i];
                            }
                            else if(i===2){
                                newgoods.pd_image3.data = fs.readFileSync('../uploads/'+paramImage[i]);
                                newgoods.pd_image3.contentType = paramImageType[i];
                            }
                            else if(i===3){
                                newgoods.pd_image4.data = fs.readFileSync('../uploads/'+paramImage[i]);
                                newgoods.pd_image4.contentType = paramImageType[i];
                            }
                        }
                    }
                    newgoods.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        //console.log(paramImg);
                        console.log("사용자 데이터 추가함.");
                        res.write('<script type="text/javascript">alert("Product Added");window.location="/administrator";</script>');
                        res.end();
                    });
                }
            });
        });
    });

    router.route('/register_edit').post(function(req, res){
        upload.array('pd_image', 4)(req, res, function(err) {
            var paramImage = [null, null, null, null];
            var paramImageType = [null, null, null, null];
            var paramPD_viewPd = false;
            var paramPD_viewFPd = false;
            var paramPD_viewNew = false;
            var paramPD_viewSale = false;
            if (req.files.length !== 0) {
                for (var i = 0; i < req.files.length; i++) {
                    paramImage[i] = req.files[i].filename;
                    paramImageType[i] = req.files[i].mimetype;
                }
            }
            if(req.body.pd_viewPd!=undefined) paramPD_viewPd = true;
            if(req.body.pd_viewFPd!=undefined) paramPD_viewFPd = true;
            if(req.body.pd_viewNew!=undefined) paramPD_viewNew = true;
            if(req.body.pd_viewSale!=undefined) paramPD_viewSale = true;
            var paramPD_name = req.body.pd_postname;
            var paramPD_price = req.body.pd_price;
            var paramPD_cate1 = req.body.pd_ct1;
            var paramPD_cate2 = req.body.pd_ct2;
            var paramPD_rel1 = req.body.pd_rel1;
            var paramPD_rel2 = req.body.pd_rel2;
            var paramPD_rel3 = req.body.pd_rel3;
            var paramPD_detail = req.body.pd_detail;
            var paramPD_des = req.body.pd_des;
            var paramPD_addin = req.body.pd_addin;
            var paramUser = req.user.name;
            var database = req.app.get('database');
            var editImg = new Array(4);
            var editImgCT = new Array(4);
            for(var i=0;i<4;i++){
                if(paramImage[i]==null){
                    editImg[i] = fs.readFileSync('../public/images/default.jpg');
                    editImgCT[i] = "image/jpeg";
                }
                else{
                    editImg[i] = fs.readFileSync('../uploads/'+paramImage[i]);
                    editImgCT[i] = paramImageType[i];
                }
            }
            database.GoodsModel.findOneAndUpdate({'pd_name': paramPD_name}, {
                $set: {
                    'pd_price': paramPD_price, 'pd_category1': paramPD_cate1, 'pd_category2': paramPD_cate2,
                    'pd_relatedpd1': paramPD_rel1, 'pd_relatedpd2': paramPD_rel2, 'pd_realtedpd3': paramPD_rel3,
                    'pd_detail': paramPD_detail, 'pd_description': paramPD_des, 'pd_additionalinfo': paramPD_addin,
                    'created_by': paramUser, 'pd_image1.data': editImg[0], 'pd_image1.contentType': editImgCT[0],
                    'pd_image2.data': editImg[1], 'pd_image2.contentType': editImgCT[1],
                    'pd_image3.data': editImg[2], 'pd_image3.contentType': editImgCT[2],
                    'pd_image4.data': editImg[3], 'pd_image4.contentType': editImgCT[3],
                    'pd_viewPd':paramPD_viewPd, 'pd_viewFPd':paramPD_viewFPd, 'pd_viewNew':paramPD_viewNew,
                    'pd_viewSale':paramPD_viewSale
                }
            }, {new: true}, function (err, goods) {

                if (err) {
                    console.log(err);
                    res.redirect('/administrator');
                }
                if (goods) {
                    console.log("상품 수정 완료.");
                    res.write('<script type="text/javascript">alert("Product Editted");window.location="/administrator";</script>');
                    res.end();
                }
                else {
                    console.log('상품없음');
                    res.redirect('/administrator');
                }
            });
        });
    });
};