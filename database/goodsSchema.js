var mongoose = require('mongoose');

module.exports = {
    GoodsSchema: mongoose.Schema({
        productid: {type: String, required: true, unique: true},
        productname: {type: String, required: true, unique: true},
        price: {type: Number, required: true},
    })
};