var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../config/config');
var userschema = require('./userSchema');
var goodsschema = require('./goodsSchema');

var database = {};
var UserSchema;
var GoodsSchema;
var UserModel;
var GoodsModel;

database.init = function(app, config){
    console.log('\n[database/database/database.init()]');

    if(app){
        if(config){
            connect(app, config);
        }else{
            console.error.bind(console, '[error] config not defined\n');
        }
    }else{
        console.error.bind(console, '[error] application error\n');
    }
}

//데이터베이스에 연결
function connect() {
    // 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
    mongoose.connect(config.dbUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + config.dbUrl);

        // 스키마 정의
        UserSchema = userschema.UserSchema;
        GoodsSchema = goodsschema.GoodsSchema;
        console.log('UserSchema 정의함.');
        console.log('GoodsSchema 정의함.');

        //UserSchema Method
        UserSchema.method('makeSalt', function() {
            return Math.round((new Date().valueOf() * Math.random())) + '';
        });
        UserSchema.method('encryptPassword', function(plainText, inSalt) {
            if (inSalt) {
                return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
            } else {
                return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
            }
        });
        UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
            if (inSalt) {
                console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
                return this.encryptPassword(plainText, inSalt) === hashed_password;
            } else {
                console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
                return this.encryptPassword(plainText) === this.hashed_password;
            }
        });
        var validatePresenceOf = function(value) {
            return value && value.length;
        };

        // 저장 시의 트리거 함수 정의 (password 필드가 유효하지 않으면 에러 발생)
        UserSchema.pre('save', function(next) {
            if (!this.isNew) return next();

            if (!validatePresenceOf(this.password)) {
                next(new Error('유효하지 않은 password 필드입니다.'));
            } else {
                next();
            }
        })

        // 필수 속성에 대한 유효성 확인 (길이값 체크)
        UserSchema.path('id').validate(function (id) {
            return id.length;
        }, 'id 칼럼의 값이 없습니다.');

        UserSchema.path('name').validate(function (name) {
            return name.length;
        }, 'name 칼럼의 값이 없습니다.');

        UserSchema.path('hashed_password').validate(function (hashed_password) {
            return hashed_password.length;
        }, 'hashed_password 칼럼의 값이 없습니다.');


        // 스키마에 static으로 findById 메소드 추가
        UserSchema.static('findById', function(id, callback) {
            return this.find({id:id}, callback);
        });

        // 스키마에 static으로 findAll 메소드 추가
        UserSchema.static('findAll', function(callback) {
            return this.find({}, callback);
        });


        //암호화
        UserSchema
            .virtual('password')
            .set(function(password){
                this._password = password;
                this.salt = this.makeSalt();
                this.hashed_password = this.encryptPassword(password);
                console.log('virtual password 호출됨 : ' + this.hashed_password);
            })
            .get(function(){return this._password});

        //모델 정의
        UserModel = mongoose.model("users", UserSchema);
        GoodsModel = mongoose.model("goods", GoodsSchema);
        console.log('UserModel 정의함.');
        console.log('GoodsModel 정의함.');

    });

    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connect, 5000);
    });
}

// 사용자를 인증하는 함수
database.authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    // 1. 아이디를 이용해 검색
    UserModel.findById(id, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색결과', id);
        console.dir(results);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');
            // 2. 패스워드 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출
            var user = new UserModel({id:id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            if (authenticated) {
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
        } else {
            console.log("아이디와 일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }
    });
}


//사용자를 추가하는 함수
database.addUser = function(database, id, password, name, email, address, auth, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name + ', ' + email + ', ' + address);

    // UserModel 인스턴스 생성
    var user = new UserModel({"id":id, "password":password, "name":name, "email":email, "address":address, "auth":auth});

    // save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
    user.save(function(err, addedUser) {
        if (err) {
            callback(err, null);
            return;
        }
        console.log("사용자 데이터 추가함.");
        callback(null, addedUser);
    });
};

module.exports = database;