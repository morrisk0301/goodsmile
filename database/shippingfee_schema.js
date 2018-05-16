//Shipping Fee & Country List

var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var ShippingfeeSchema = mongoose.Schema({
        country: {type: String, unique:true}
        , region: {type: String, 'default':''}
        , fee: {
            below_5: {type: Number, 'default': 0},
            below1: {type: Number, 'default': 0},
            below1_5: {type: Number, 'default': 0},
            below2: {type: Number, 'default': 0},
            below2_5: {type: Number, 'default': 0},
            below3: {type: Number, 'default': 0},
            below3_5: {type: Number, 'default': 0},
            below4: {type: Number, 'default': 0},
            below4_5: {type: Number, 'default': 0},
            below5: {type: Number, 'default': 0},
            below5_5: {type: Number, 'default': 0},
            below6: {type: Number, 'default': 0},
            below6_5: {type: Number, 'default': 0},
            below7: {type: Number, 'default': 0},
            below7_5: {type: Number, 'default': 0},
            below8: {type: Number, 'default': 0},
            below8_5: {type: Number, 'default': 0},
            below9: {type: Number, 'default': 0},
            below9_5: {type: Number, 'default': 0},
            below10: {type: Number, 'default': 0},
            below10_5: {type: Number, 'default': 0},
            below_11: {type: Number, 'default': 0},
            below11_5: {type: Number, 'default': 0},
            below12: {type: Number, 'default': 0},
            below12_5: {type: Number, 'default': 0},
            below13: {type: Number, 'default': 0},
            below13_5: {type: Number, 'default': 0},
            below14: {type: Number, 'default': 0},
            below14_5: {type: Number, 'default': 0},
            below15: {type: Number, 'default': 0},
            below15_5: {type: Number, 'default': 0},
            below16: {type: Number, 'default': 0},
            below16_5: {type: Number, 'default': 0},
            below17: {type: Number, 'default': 0},
            below17_5: {type: Number, 'default': 0},
            below18: {type: Number, 'default': 0},
            below18_5: {type: Number, 'default': 0},
            below19: {type: Number, 'default': 0},
            below19_5: {type: Number, 'default': 0},
            below20: {type: Number, 'default': 0}
        }
    });

    console.log('shippingfee_Schema 정의함.');
    return ShippingfeeSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

