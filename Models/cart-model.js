const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;