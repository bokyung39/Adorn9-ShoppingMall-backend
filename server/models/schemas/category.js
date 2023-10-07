const { Schema } = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = { CategorySchema };