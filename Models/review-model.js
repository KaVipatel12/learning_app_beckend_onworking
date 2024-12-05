const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        unique: true // Ensure only one review document per course
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            stars: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

