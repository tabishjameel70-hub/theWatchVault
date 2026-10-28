const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // --- Customer Details ---
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phoneNum: { 
        type: String, 
        required: true 
    },

    // --- Shipping Information ---
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    zipCode: { 
        type: String, 
        required: true 
    },
    homeType: { 
        type: String, 
        enum: ['House', 'Apartment', 'Office', 'Other'], // Restricts input to these exact words
        default: 'House'
    },
    shippingMethod: { 
        type: String, 
        required: true 
    },

    // --- Payment Information ---
    paymentMethod: { 
        type: String, 
        enum: ['COD', 'Bank'], // Restricts input to Cash on Delivery or Bank Transfer
        required: true 
    },

    // --- Order Data (Highly Recommended) ---
    // Links this order to the guest session or logged-in user
    sessionId: { 
        type: String, 
        required: true 
    },
    // Saves exactly what watches they bought during checkout
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product', // Assuming your product model is named 'Product'
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true,
            default: 1
        },
        priceAtPurchase: { 
            type: Number, 
            required: true 
        }
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' timestamps
});

module.exports = mongoose.model('Order', orderSchema);