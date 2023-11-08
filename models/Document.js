const mongoose = require("mongoose");

const Document = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        default: ""
    },
    userName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    ducumentDate: {
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
    status: {
        type: String,
        default: "Incomplete"
    }
}, { timestamps: true });

module.exports = mongoose.model("document", Document);