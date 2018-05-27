module.exports = function(router) {
    var currencyrate = 1028;
    var braintree = require("braintree");
    var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: "gn68h5xvwfzrpb5n",
        publicKey: "mvgq5rnf54dnbfgs",
        privateKey: "dc88f545bfd447d12c69a357ba161a16"
    });
    //order 화면
    router.route('/order').get(function(req, res) {
        console.log('/order 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            if(req.user.order.length==0) res.redirect('/');
            else {
                gateway.customer.create({
                    firstName: req.user.name,
                    email: req.user.email,
                    phone: req.user.cellnum
                }, function(err, results){
                    if(err) console.log(err);
                    gateway.clientToken.generate({customerId: results.customer.id}, function (err, response) {
                        var token = response.clientToken;
                        var database = req.app.get('database');
                        database.ShippingfeeModel.find().exec(function (err, results) {
                            console.log('사용자 인증된 상태임.');
                            res.render('order.ejs', {
                                login_success: true,
                                user: req.user,
                                shipping: results,
                                currencyrate: currencyrate,
                                cltoken: token
                            });
                        });
                    });
                });
            }
        }
    });
    router.route('/addorder').post(function(req, res) {
        console.log('/addorder 패스 요청됨.');
        var paramId = req.body.pd_id;
        var paramName = req.body.pd_name;
        var paramNum = parseInt(req.body.pd_num);
        var paramPrice = req.body.pd_price;
        var paramWeight = req.body.pd_weight;
        var paramIsfirst = req.body.isfirst;
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            var database = req.app.get('database');
            if(paramIsfirst=='1') {
                database.UserModel.findOneAndUpdate({'email': req.user.email}, {$set: {'order': []}}, {new: true}, function (err, user_e) {
                    database.UserModel.findOneAndUpdate({'email': req.user.email}, {
                        $push: {
                            'order': {
                                'order_id': paramId,
                                'order_num': paramNum, 'order_name': paramName, 'order_price': paramPrice,
                                'order_weight': paramWeight
                            }
                        }
                    }, {new: true}, function (err, user_e) {
                        console.log('order 추가됨');
                        req.session.regenerate(function (err) {
                            req.logIn(user_e, function (error) {
                                req.session.save(function (err) {
                                    res.redirect('/order');
                                });
                            });
                        });
                    });
                });
            } else{
                database.UserModel.findOneAndUpdate({'email': req.user.email}, {
                    $push: {
                        'order': {
                            'order_id': paramId,
                            'order_num': paramNum, 'order_name': paramName, 'order_price': paramPrice,
                            'order_weight': paramWeight
                        }
                    }
                }, {new: true}, function (err, user_e) {
                    console.log('order 추가됨');
                    req.session.regenerate(function (err) {
                        req.logIn(user_e, function (error) {
                            req.session.save(function (err) {
                                res.redirect('/order');
                            });
                        });
                    });
                });
            }
        }
    });

    router.route('/checkout').post(function(req, res){
        console.log('/checkout 패스 요청됨.');
        console.log(req.body);
        var nonceFromTheClient = req.body.payment_method_nonce;
        var price = req.body.totalprice;
        gateway.transaction.sale({
            amount: price,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        }, function (err, result) {
            if(result){
                console.log(result);
                res.send(result);
            } else {
                res.status(500).send(error);
            }
        });

    });
    router.route('/confirm').post(function(req, res) {
        console.log('/confirm 패스 요청됨.');
        console.log(req.body);
        var paramTotalWeight = req.body.totalweight;
        var paramTotalPrice = req.body.totalprice;
        var paramShippingMethod = req.body.shippingmethod;
        var nonceFromTheClient = req.body.payment_method_nonce;
        var price = req.body.totalprice;
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            var database = req.app.get('database');
            var neworder = new database.OrderModel({
                'email': req.user.email, 'name': req.user.name, 'address': req.user.address,
                'address2': req.user.address2, 'city': req.user.city, 'state': req.user.state,
                'zip': req.user.zip, 'country': req.user.country, 'cellnum': req.user.cellnum,
                'totalweight': paramTotalWeight, 'totalprice': paramTotalPrice, 'status': 'Checking Order',
                'order': req.user.order, 'shippingmethod': paramShippingMethod
            });

            neworder.save(function(err){
                if(err) console.log(err);
                console.log('Order Complete!');
                database.UserModel.findOneAndUpdate({'email': req.user.email}, {$set: {'order': []}}, {new: true}, function (err, user_e) {
                    if(err) console.log(err);
                    gateway.transaction.sale({
                        amount: price,
                        paymentMethodNonce: nonceFromTheClient,
                        options: {
                            submitForSettlement: true
                        }
                    }, function (err, result) {
                        if(result){
                            req.session.regenerate(function (err) {
                                req.logIn(user_e, function (error) {
                                    req.session.save(function (err) {
                                        res.redirect('/complete');
                                    });
                                });
                            });
                        } else {
                            res.status(500).send(error);
                        }
                    });
                });
            });
        }
    });

    router.route('/complete').get(function(req, res) {
        console.log('/complete 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('complete.ejs', {login_success:true, user: req.user});
        }
    });

    router.route('/order_view').get(function(req, res) {
        console.log('/order_view 패스 요청됨.');
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            if (!req.user.auth == 0) {
                console.log('관리자 아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                var database = req.app.get('database');
                database.OrderModel.find().exec(function(err, results){
                    res.render('order_view.ejs', {login_success:true, user: req.user, order:results});
                });
            }
        }
    });

    router.route('/order_edit').get(function(req, res) {
        console.log('/order_edit 패스 요청됨.');
        var paramOrderid = req.query.order_id;
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            if (!req.user.auth == 0) {
                console.log('관리자 아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                var database = req.app.get('database');
                database.OrderModel.findOne({'order_id': paramOrderid}, function(err, result){
                    if(err) console.log(err);
                    res.render('order_edit.ejs', {login_success:true, user: req.user, order:result});
                });
            }
        }
    });

    router.route('/order_edit').post(function(req, res) {
        console.log('/order_edit 패스 요청됨.');
        var paramStatus = req.body.status;
        var paramShippingInvoice = req.body.shipping_invoice;
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            if (!req.user.auth == 0) {
                console.log('관리자 아님');
                res.redirect('/');
            }
            else{
                console.log('사용자 인증된 상태임.');
                var database = req.app.get('database');
                database.OrderModel.findOneAndUpdate({'order_id': req.body.order_id}, {
                    $set: {
                        'status': paramStatus, 'shipping_invoice': paramShippingInvoice
                    }}, {new: true}, function (err, results) {
                    console.log("주문 수정 완료.");
                    res.write('<script type="text/javascript">alert("Order Edited");window.location="/order_view";</script>');
                    res.end();
                });
            }
        }
    });

    router.route('/myorder').get(function(req, res) {
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else{
            var database = req.app.get('database');
            database.OrderModel.find({'email':req.user.email}).exec(function(err, results){
                res.render('myorder.ejs', {login_success:true, user: req.user, order:results});
            });
        }
    });
};