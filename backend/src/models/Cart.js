const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // We use sessionId to track the guest browser
    sessionId: { 
        type: String, 
        required: true 
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product' 
        },
        quantity: { 
            type: Number, 
            default: 1 
        }
    }]
});

module.exports = mongoose.model('Cart', cartSchema);