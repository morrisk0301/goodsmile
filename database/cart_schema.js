var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var CartSchema = mongoose.Schema({
		user_email: {type: String, 'default':''}
		, cart_id: {type:String, 'default':''}
        , cart_name: {type:String, 'default':''}
		, cart_num: {type:Number, 'default':1}
		, cart_price: {type:Number, 'default':0}
		, cart_weight: {type:Number, 'default':0}
	});
	
	console.log('CartSchema 정의함.');

	return CartSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

