const mongoose = require("mongoose");

const providerSchema = mongoose.Schema({
    username: String,
    mobile: String,
    email: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    },
    role : {
        type : String,
        default : "provider"
    },
    courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
});


const Provider = new mongoose.model("Provider", providerSchema)
module.exports = Provider; 
