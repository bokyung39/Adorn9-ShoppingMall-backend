const { Schema } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    images: String,
    detail: String,
    maker: String,
    },
    {timestamps: true}
);

module.exports = { ProductSchema };