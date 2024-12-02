const User = require("../Models/user-model")
const {Course} = require("../Models/course-model")
const {Chapter} = require("../Models/course-model")
const Comment = require("../Models/comments-model")
 

// Add the comment by the user. 
const addComment = async(req, res) => {
  const {comment} = req.body;
  const chapterId = "674c34afbd0ebc13a6dfe82a";
  const userId = req.user._id; 

  const inputComment = await Comment.create({
    comment, chapterId, userId
  }) 
  console.log(inputComment)
  if(!inputComment){
    return res.status(400).send({msg : "Comment not added"})
  }
  
  //Adding the comment id in the chapter model in the student router. 
  const updatedChapter = await Chapter.findByIdAndUpdate(
    chapterId,
    { $push: {comment: inputComment._id}},  
    { new: true, useFindAndModify: false }
  ); 
  
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: {comment: inputComment._id}},  // Push the course ID
    { new: true, useFindAndModify: false }
  ); 
  return res.status(400).send({msg : "Comment added"},   updatedChapter, 
    updatedUser)
}

// delete the comment by the user. 
const deleteComment = async (req, res) => {
  const commentId = "674da606b7bed6ce5efdced5"; 
  const chapterId = "674c34afbd0ebc13a6dfe82a"; 
  const userId = req.user._id; 

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  
  if (!deletedComment) {
    return res.status(400).send({ msg: "Comment not deleted" });
  }

  const updatedChapter = await Chapter.findByIdAndUpdate(
    chapterId,
    { $pull: { comment: commentId } },
    { new: true, useFindAndModify: false }
  );

  if (!updatedChapter) {
    return res.status(400).send({ msg: "Error removing comment from chapter" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { comment: commentId } },
    { new: true, useFindAndModify: false }
  );

  if (!updatedUser) {
    return res.status(400).send({ msg: "Error removing comment from user" });
  }

  return res.status(200).send({ msg: "Comment deleted" });
};


module.exports = {addComment, deleteComment}