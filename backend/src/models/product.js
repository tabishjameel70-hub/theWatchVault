const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'product name must be required!'],
    },
    category: {
        type: String,
        enum: ["Men's", "Women's"],
        required: [true, 'product category must be required!'],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be less than 0"]
    },
    stockQuantity: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, 'description must be required!'],
    },
    productImages: {
        type: [String],
        default: []
    }
})

ProductSchema.index({ user: 1, status: 1 });
const productModel = mongoose.model("product", ProductSchema);
module.exports = productModel; // Make sure you export it!