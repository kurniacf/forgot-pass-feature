const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        maxlength: 50,
        required: true,
    },
    password: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true,
    },
    refreshJWT: {
        token: {
            type: String,
            maxlength: 500,
            default: "",
        },
        addedAt: {
            type: Date,
            required: true,
            default: Date.now(),
        },
    },
    // isVerified: {
    //     type: Boolean,
    //     required: true,
    //     default: false,
    // },
});

module.exports = {
    UserSchema: mongoose.model("User", UserSchema),
};