const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
    pin: {
        type: String,
        maxlength: 4,
        minlength: 4,
    },
    email: {
        type: String,
        maxlength: 50,
        required: true,
    },
    addedAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

module.exports = {
    ResetPinSchema: mongoose.model("Reset_pin", ResetPinSchema),
};