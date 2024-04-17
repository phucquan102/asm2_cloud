const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name : String,
    description: String,
    price: Number,
    image: String,
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories' // Tham chiếu đến bảng Category
      }
})
const ProductModel = mongoose.model('products', ProductSchema);
module.exports = ProductModel;