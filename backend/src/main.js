require('dotenv').config();
const express = require('express');
const Admin = require('./models/Admin');
const Product = require('./models/product')
const connectToDB = require('../config/db');
const jwt = require('jsonwebtoken')
const app = express();
const path = require('path')
const multer = require('multer');
const Cart = require('./models/Cart');
const Order = require('./models/checkout')
const bcrypt = require('bcrypt')
const userModel = require('./models/user')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
const imageUploadPath = path.join(__dirname, 'public/uploads/images');
const port = 3000;
app.use(express.json());
connectToDB();
const seedAdmin = async () => {
    try {
        console.log('⏳ Forcing bulletproof admin reset...');
        const bcrypt = require('bcrypt');
        // 1. Wipe out the broken admin account completely
        await Admin.deleteMany({ email: 'iftikharanus45@gmail.com' })
        // 2. Generate the hash manually right here in main.js
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('spideradmin1!', salt);

        // 3. Insert directly into MongoDB (Bypasses Mongoose models so it CANNOT fail)
        await Admin.collection.insertOne({
            name: 'Anas iftikhar',
            email: 'iftikharanus45@gmail.com',
            password: hashedPassword,
            role: 'superadmin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ SUCCESS: Admin account created with a guaranteed valid hash!');
    } catch (error) {
        console.error('❌ SEED SCRIPT CRASHED:', error.message);
    }
};
setTimeout(seedAdmin, 3000);
// image uploading
const fs = require('fs')
if (!fs.existsSync(imageUploadPath)) {
    fs.mkdirSync(imageUploadPath, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageUploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'img-' + uniqueSuffix + extension);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
app.use('/images', express.static(imageUploadPath));
// ..
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/admin/login', (req, res) => {
    res.send('Admin login route is active');
});
// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
    const email = req.body.email ? req.body.email.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";
    try {
        console.log('\n--- ADMIN LOGIN ATTEMPT ---');
        console.log(`1. Email from form: "${email}"`);
        console.log(`2. Password from form: "${password}" (Length: ${password.length})`);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            console.log('3. Result: Admin NOT found in DB');
            return res.status(404).json({ success: false, message: 'Invalid credentials.' });
        }
        console.log(`3. Result: Admin found!`);
        console.log(`4. Password in DB: "${admin.password}"`);
        if (!admin.isActive) {
            console.log('5. Result: Account disabled');
            return res.status(403).json({ success: false, message: 'Account disabled.' });
        }
        const isMatch = await admin.comparePassword(password);
        console.log(`5. Password Match Result: ${isMatch}`);
        if (!isMatch) {
            console.log('-> FAILED: bcrypt.compare returned false.');
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        console.log('-> SUCCESS: Passwords match! Generating token...');
        // 1. Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.MONGO_JWT,
            { expiresIn: '12h' }
        );
        // 2. Store in HTTP-only cookie (Optional, but still works great for React apps)
        res.cookie('superAdminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        // 3. Send success JSON back to React (React will handle the navigation to /admin)
        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token // You can also send the token in the JSON if your React app prefers saving it in localStorage
        });
    } catch (error) {
        console.error("SERVER ERROR:", error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});
app.get('/api/signup', (req, res) => {
    res.send('sigin')
})
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async (err, hash) => {
                const createUser = await userModel.create({
                    name,
                    email,
                    password: hash
                });
                const token = jwt.sign({ email }, process.env.MONGO_JWT);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                // 3. Send success JSON back to React (React will handle the navigation to /admin)
                return res.status(200).json({
                    success: true,
                    message: 'Login successful!',
                    token // You can also send the token in the JSON if your React app prefers saving it in localStorage
                });
            });
        });
    } catch (error) {
        console.error("SERVER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: 'Server error.',
            // Only send the real error details if you aren't in production
            error: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
})
// product listing
app.get('/api/admin/products', isAdmin, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ _id: -1 });
        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
})
app.post('/api/admin/productlisting', isAdmin, upload.single('productImages'), async (req, res) => {
    // 1. Added stockQuantity to req.body extraction
    const { productName, category, price, description, stockQuantity } = req.body;
    const productImages = req.file;

    if (!productName || !category || !price || !description || !productImages) {
        return res.status(400).json({
            message: "productName, category, price, description, and productImages are required."
        });
    }

    try {
        const imagePath = `/images/${productImages.filename}`;

        const createProduct = await Product.create({
            productName,
            category,
            price,
            description,
            stockQuantity,
            productImages: [imagePath] // Wrap this in an array
        });

        res.status(201).json({
            success: true,
            data: createProduct,
            message: "Product created successfully",
        });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: err.message
        });
    }
});
app.get('/api/admin/products/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
app.put('/api/admin/products/:id', isAdmin, upload.single('productImages'), async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.admin.email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin not found or unauthorized" });
        }

        // Prepare the basic data updates
        const updatedData = {
            productName: req.body.name,          // Frontend sends 'name'
            description: req.body.description,
            price: req.body.price,
            stockQuantity: req.body.stock,       // Frontend sends 'stock'
            category: req.body.category,
            status: 'updated'
        };

        // ONLY update the image path if a new file was actually uploaded
        if (req.file) {
            updatedData.productImages = [`/images/${req.file.filename}`];
        }

        // Find and update in ONE single step
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ success: false, message: "Server error while updating product" });
    }
});
app.get('/api/product-details/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(201).json({
            success: false, message: "Product not found"
        })
    }
    res.status(200).json({
        succes: true,
        data: product
    })
})
app.get('/api/cart-product', async (req, res) => {
    try {
        const sessionId = req.headers['session-id'];
        const cart = await Cart.findOne({ sessionId }).populate('items.productId');
        return res.status(200).json({
            success: true,
            data: cart ? cart.items : []
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch cart" });
    }
});
// Express Backend Route
app.post('/api/cart-product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const sessionId = req.headers['session-id'];

        if (!sessionId) {
            console.log("ERROR: Session ID is missing!");
            return res.status(400).json({ success: false, message: "Session ID missing" });
        }

        // 1. Fetch the product from the database first
        const product = await Product.findById(productId);

        // Safety Check: Does the product even exist?
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Safety Check: Is the product completely out of stock?
        if (product.stockQuantity <= 0) {
            return res.status(400).json({ success: false, message: "This item is currently out of stock." });
        }

        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        // 2. Figure out what the new quantity WOULD be if we let them add it
        const currentQuantityInCart = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
        const requestedQuantity = currentQuantityInCart + 1;

        // 3. Block the action if the requested quantity exceeds available stock
        if (requestedQuantity > product.stockQuantity) {
            return res.status(400).json({
                success: false,
                message: `You cannot add more. Only ${product.stockQuantity} left in stock.`
            });
        }

        // 4. Only update the cart if all safety checks pass
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = requestedQuantity;
        } else {
            cart.items.push({ productId, quantity: 1 });
        }

        await cart.save();
        console.log(`SUCCESS: Added ${product.name} to cart. Cart Qty is now ${requestedQuantity}.`);

        res.status(200).json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// --- REMOVE ITEM FROM CART (DELETE ROUTE) ---
app.delete('/api/cart-product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const sessionId = req.headers['session-id'];

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID missing" });
        }

        const cart = await Cart.findOne({ sessionId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out the item that matches the ID, leaving the rest of the cart intact
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Save the updated cart back to MongoDB
        await cart.save();

        res.status(200).json({ success: true, message: "Item removed successfully" });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Server error while removing item" });
    }
});
app.get('/api/check-out', async (req, res) => {
    try {
        const sessionId = req.headers['session-id'];
        const cart = await Cart.findOne({ sessionId }).populate('items.productId');
        return res.status(200).json({
            success: true,
            data: cart ? cart.items : []
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch cart" });
    }
})
app.post('/api/check-out', async (req, res) => {
    try {
        const sessionID = req.headers['session-id'];

        // 1. Validate Session ID immediately
        if (!sessionID) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required to place an order."
            });
        }

        const {
            name, email, phoneNum, address, city, zipCode,
            homeType, shippingMethod, paymentMethod, items,
            totalAmount, orderStatus
        } = req.body;

        // 2. PRE-CHECK PHASE: Verify all items BEFORE touching the database
        const productsToUpdate = []; // Store the products so we don't have to query them again

        for (const item of items) {
            const productId = item.productId?._id || item.productId || item._id;
            const purchasedQty = item.quantity || 1;

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productId} not found.` });
            }

            if (product.stockQuantity < purchasedQty) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Only ${product.stockQuantity} left.`
                });
            }

            // Push to our array for the next phase
            productsToUpdate.push({ document: product, purchasedQty });
        }

        // 3. EXECUTION PHASE: Deduct the stock only after all items passed the check
        for (const target of productsToUpdate) {
            target.document.stockQuantity -= target.purchasedQty;
            await target.document.save();
        }

        // 4. Create the Order
        const createOrder = await Order.create({
            name,
            email,
            phoneNum,
            address,
            city,
            zipCode,
            homeType,
            shippingMethod,
            paymentMethod,
            sessionId: sessionID,
            items,
            totalAmount,
            orderStatus: orderStatus || 'Pending'
        });

        // 5. Clear the Cart
        await Cart.deleteMany({ sessionId: sessionID });

        // 6. Respond Success
        res.status(201).json({
            success: true,
            data: createOrder,
            message: "Order was created successfully!"
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to place order. Please check the data.",
            error: error.message
        });
    }
});
app.get('/api/orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('items.productId');
        if (!orders) {
            return res.status(201).json({
                message: "there is no order yet..",
                data: [],
                success: false
            })
        }
        res.status(200).json({
            message: "...",
            data: orders,
            success: true
        })
    } catch (error) {
        console.error('orders loading error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to load orders. Please check the data.",
            error: error.message
        });
    }
})
async function isAdmin(req, res, next) {
    try {
        // Look for the dedicated admin cookie name
        const token = req.cookies.superAdminToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing. Please log in.",
                errorType: "AUTH_TOKEN_MISSING" // Helps frontend identify why it failed
            });
        }
        const decoded = jwt.verify(token, process.env.MONGO_JWT);
        const admin = await Admin.findById(decoded.id);
        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized access",
                message: "This account is either not an admin or has been deactivated.",
                code: "ADMIN_INACTIVE" // A short code can help your frontend handle specific errors
            });
        }
        req.admin = admin;
        next();
    } catch (error) {
        // 1. Log the error securely on your server for debugging
        console.error("Admin Auth Error:", error.message);

        // 2. Clear the invalid/expired token cookie instantly
        res.clearCookie('superAdminToken');

        // 3. Send a 401/500 JSON response instead of a redirect
        return res.status(401).json({
            success: false,
            message: "Your session has expired or is invalid. Please log in again.",
            redirectTo: "/admin/login" // A helpful hint for your frontend
        });
    }

}
async function isLoggined(req, res, next) {
    if (!req.cookies || !req.cookies.token) {
        return res.redirect('/login');
    }
    try {
        let decoded = jwt.verify(req.cookies.token, JWT);
        // Fetch the full user document so req.user contains _id
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    } catch (err) {
        res.redirect('/login');
    }
}
connectToDB().then(() => {
    // Start server after DB connection succeeds
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});