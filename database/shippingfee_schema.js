//Shipping Fee & Country List

var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var ShippingfeeSchema = mongoose.Schema({
        method_name:{type:String, unique:true},
        method_detail: [{
            country: {type: String}
            , region: {type: String, 'default': ''}
            , fee: [{
                fee_name: {type: String, 'default': ''},
                fee_num: {type: Number, 'default':0}
            }]
        }],
        created_by: {type: String, 'default':''},
    });

    console.log('shippingfee_Schema 정의함.');
    return ShippingfeeSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

