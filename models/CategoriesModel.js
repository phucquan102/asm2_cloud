const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    name: String,
    description: String
});
const CategotiesModel = mongoose.model('categories', CategoriesSchema);
module.exports = CategotiesModel;