const mongoose = require('mongoose');
const { CategorySchema } = require('./schemas/category');
const { OrderSchema } = require('./schemas/order');
const { ProductSchema } = require('./schemas/product');
const { UserSchema } = require('./schemas/user');
const { AdSchema } = require('./schemas/ad');

exports.Category = mongoose.model('Category', CategorySchema)
exports.Order = mongoose.model('Order', OrderSchema);
exports.Product = mongoose.model('Product', ProductSchema);
exports.User = mongoose.model('User', UserSchema);
exports.Ad = mongoose.model('Ad', AdSchema);