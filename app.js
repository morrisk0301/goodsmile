var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

// 익스프레스 객체 생성
var app = express();

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//라우팅 정보를 읽어들여 라우팅 설정
var router = express.Router();
app.use('/', router);

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 패스포트 라우팅 설정
var userRouter = require('./routes/route_user');
userRouter(router, passport);

var productRouter = require('./routes/route_product');
productRouter(router);

var pageRouter = require('./routes/route_page');
pageRouter(router);

var orderRouter = require('./routes/route_order');
orderRouter(router);

var adminRouter = require('./routes/route_admin');
adminRouter(router);

var braintreeRouter = require('./routes/route_braintree');
braintreeRouter(router);

//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
    static: {
        '404': '../public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

module.exports = app;