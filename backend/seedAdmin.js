const mongoose = require('mongoose');
const Admin = require('./src/models/Admin')
require('dotenv').config();
const seedAdmin = async () => {
    try {
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGO_URI);
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
seedAdmin();