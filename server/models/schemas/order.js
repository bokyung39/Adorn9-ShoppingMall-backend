const { Schema } = require('mongoose');

const OrderSchema = new Schema({
    ordered_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    items: [
        {
            item: {
                type: String, //상품이름
                required: true,
            },
            quantity: Number,
        }
    ],
    total_price: {
        type: Number,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },  
    phone_number: {
        type: String,
        required: true,
    },
    status: String,
    },{
    timestamps: true,
});

module.exports = { OrderSchema };