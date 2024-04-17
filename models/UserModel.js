const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
    },
    cart: [{
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
