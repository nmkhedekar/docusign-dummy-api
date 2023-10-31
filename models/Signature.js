const mongoose = require("mongoose");

const Signature = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        default: ""
    },
    userName: {
        type: String,
        default: ""
    },
    signatureDate: {
        type: Date,
    },
    filePath: {
        type: Array,
        default: []
    },
    fileName: {
        type: String,
        default: ""
    },
}, { timestamps: true });

module.exports = mongoose.model("signature", Signature);