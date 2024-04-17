const mongoose = require('mongoose');
const RoleSchema = new mongoose.Schema({
    name: String,
    permissions: [String]
});
const RoleModel = mongoose.model('roles', RoleSchema );
module.exports = RoleModel ;