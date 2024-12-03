const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: {
        type:String
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId, ref: "User"
    },
    courseId : {
        type : mongoose.Schema.Types.ObjectId, ref: "Course"
    },
    createdAt : {
    type: Date,
    default: Date.now
}
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
