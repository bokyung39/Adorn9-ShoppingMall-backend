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
    },
    {timestamps: true}
);

module.exports = { ProductSchema };

// 추가로 카테고리 DB와의 연결 필요
// stock기능 보류