const mongoose = require("mongoose");

const connectDB = (url) => {
    mongoose.connect(url);
    return mongoose.connection
    .once('open', () => console.log("Connected to Mongo @ port 27017"))
    .on('error', error => console.log("Error connecting to mongo server", error));
};

module.exports = connectDB;