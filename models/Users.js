
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String }
});
var user = mongoose.model('myuser', userSchema);
var admin = {
    email: 'admin',
    password: 'admin'
}
exports.User = user;
exports.admin = admin;