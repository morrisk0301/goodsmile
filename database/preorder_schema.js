var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var PreorderSchema = mongoose.Schema({
		user_email: {type: String, 'default':''}
		, order_id: {type:String, 'default':''}
        , order_name: {type:String, 'default':''}
		, order_num: {type:Number, 'default':1}
		, order_price: {type:Number, 'default':0}
		, order_weight: {type:Number, 'default':0}
	});
	
	console.log('CartSchema 정의함.');

	return PreorderSchema;
};

module.exports = Schema;

