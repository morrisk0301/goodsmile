/**
 * 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2016-11-10
 * @author Mike
 */


var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var GoodsSchema = mongoose.Schema({
        pd_id: {type: String, unique:true}
        , pd_name: {type: String, unique:true}
        , pd_price: {type: Number, 'default':0}
        , pd_category1: {type: String, 'default':''}
        , pd_category2: {type: String, 'default':''}
        , pd_relatedpd: [{
            rel_id: {type:String, 'default':''},
            rel_name: {type:String, 'default':''},
            cart_num: {type:Number, 'default':1},
            cart_price: {type:Number, 'default':0},
        }]
        , pd_detail: {type: String, 'default':''}
        , pd_description: {type: String, 'default':''}
        , pd_additionalinfo: {type: String, 'default':''}
        , pd_image1: {data: Buffer, contentType: String}
        , pd_image2: {data: Buffer, contentType: String}
        , pd_image3: {data: Buffer, contentType: String}
        , pd_image4: {data: Buffer, contentType: String}
        , pd_viewPd: {type: Boolean, 'default':false}
        , pd_viewFPd: {type: Boolean, 'default':false}
        , pd_viewNew: {type: Boolean, 'default':false}
        , pd_viewSale: {type: Boolean, 'default':false}
        , created_by: {type: String, 'default':''}
        , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    // 모델 객체에서 사용할 수 있는 메소드 정의
    GoodsSchema.static('findByEmail', function(email, callback) {
        return this.find({email:email}, callback);
    });

    GoodsSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });

    console.log('UserSchema 정의함.');

    return GoodsSchema;
};

module.exports = Schema;