const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: { type: String, required: true},
    likes : {type : Number}, 
    chapterId : {type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt : {
    type: Date,
    default: Date.now
}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
