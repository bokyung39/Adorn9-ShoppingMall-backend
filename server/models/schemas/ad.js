const { Schema } = require('mongoose');

const AdSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    }
});

module.exports = { AdSchema };