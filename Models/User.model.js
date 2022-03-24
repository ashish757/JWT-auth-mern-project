const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        minlength: 2,
        maxlength: 40
    },
    email: {
        required: true,
        type: String,
        unique: true,
        validate: [
            async function(value) {
                const result = await this.constructor.findOne({ email: value })

                if (result) return false
                return true
            },
            "Email is already taken!"
        ]
    },
    password: {
        required: true,
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
    }
})


userSchema.pre('save', async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // generate a salt
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

});

const User = mongoose.model('user', userSchema)


module.exports = User