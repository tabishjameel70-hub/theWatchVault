const mongoose = require('mongoose');
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'email is required for further processing'],
        trim: true,
        lowercase: true,
        match: [emailRegex, 'Please provide a valid email address'],
        unique: [true, 'email already registered'],
    },
    password: {
        type: String,
        required: [true, 'password is required for further processing'],
        minLength: [6, 'password must be at least 6 characters'],
        select: false
    }
}, { timestamps: true })
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;