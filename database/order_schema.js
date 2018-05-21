//Shipping Fee & Country List

var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var orderSchema = mongoose.Schema({
        email: {type: String, 'default':''}
        , name: {type: String, index: 'hashed', 'default':''}
        , address: {type: String, 'default':''}
        , address2: {type: String, 'default':''}
        , city: {type: String, 'default':''}
        , state: {type: String, 'default':''}
        , zip: {type: String, 'default':''}
        , country: {type: String, 'default':''}
        , cellnum: {type: String, 'default':''}
        , shippingmethod: {type: String, 'default':''}
        , totalweight: {type:Number, 'default':0}
        , totalprice: {type:Number, 'default':0}
        , status: {type:String, 'default':'Checking Order'}
        , shipping_invoice: {type:String, 'default':''}
        , ordered_at: {type: Date, index: {unique: false}, 'default': Date.now}
        , order: []
    });

    console.log('order_Schema 정의함.');
    return orderSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

