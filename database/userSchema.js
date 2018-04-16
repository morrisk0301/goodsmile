var mongoose = require('mongoose');

module.exports = {
    UserSchema: mongoose.Schema({
        id: {type: String, required: true, unique: true, 'default' : ' '},
        hashed_password: {type: String, required: true, 'default' : ' '},
        salt: {type: String, required: true},
        name: {type: String, required: true, 'default' : ' '},
        email: {type: String, required: true},
        address: {type: String, required: true},
        auth: {type: String, required: true},
    })
};
