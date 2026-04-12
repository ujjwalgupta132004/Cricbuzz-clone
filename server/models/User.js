const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    favorites: [{
        sport: { type: String, enum: ['cricket', 'football', 'tennis'] },
        matchId: String,
        matchName: String
    }],
    preferredSports: [{ type: String, enum: ['cricket', 'football', 'tennis'] }],
    darkMode: { type: Boolean, default: false }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    next();
});

userSchema.methods.comparePassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};


module.exports = mongoose.model('User', userSchema);
