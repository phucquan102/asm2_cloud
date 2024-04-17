const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // Tham chiếu đến bảng User
      },
      products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
      total_price: Number,
      status: String
});
const OrderModel = mongoose.model('orders', OrderSchema );
module.exports = OrderModel ;