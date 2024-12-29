const mongoose = require("mongoose");
 
const userSchema = mongoose.Schema({
    username: String,
    mobile: String,
    email: String,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    controll: {
        type: Number,
        default: 0    // 0 -> user, 1 -> Admin, 2 -> Editor 
    },
    date: {
        type: Date,
        default: Date.now
    },
    role : {
        type : String,
        default : "student"
    },
    comment:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
    ],
    purchaseCourse: [{
        courseId : String,
        title : String, 
        category : String,
        purchaseDate: {
            type : Date,
            default: Date.now
        }
    }]
});

const User = new mongoose.model("User", userSchema)
module.exports = User; 