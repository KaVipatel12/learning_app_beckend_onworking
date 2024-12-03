const User = require("../Models/user-model")
const {Chapter} = require("../Models/course-model")
const {Course} = require("../Models/course-model")
const Review = require("../Models/review-model")
const Comment = require("../Models/comments-model")
const mongoose = require("mongoose")
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

// Adding the course review by the users who are enrolled in it
const addReview = async (req, res) => {

  const { review } = req.body; // Get the review from the request body
  const courseId = "674c33e69f445a3f969f461e"; // Get courseId from the URL parameter
  const userId = "674d834b98611d382b7c64ac";
  if (!review || typeof review !== 'number') {
    return res.status(400).send({ msg: 'Error' });
  }

  try {

    const isCourseAvailable = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
      'purchaseCourse.course': {$in : new mongoose.Types.ObjectId(courseId)}
    });

    if(!isCourseAvailable){
      return res.status(400).send({msg : "Purchase the course to review"})
    }

     const findReview = Review.findOne({userId}, 'review')
     console.log(findReview)
     if(findReview){
      return res.status(400).send({msg : "Review can only be added  once"})
     }

      const addReview = await Review.create({
      review , userId , courseId
    })
    
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { review: addReview._id } },  // Push the new review into the reviews array
      { new: true, useFindAndModify: false }
    );
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { review: addReview._id } },  // Push the new review into the reviews array
      { new: true, useFindAndModify: false }
    );

    if (!addReview) {
      return res.status(404).send({ msg: ' Review not added.' });
    }

    return res.status(200).send({ msg: 'Thank you for your review!', course: addReview });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: 'There was an error adding your review.' });
  }
};

// updating the course review 
const updateReview = async (req, res) => {

  const { updatedReview } = req.body; // Get the review from the request body

  const userId = "674be6a529f025251b882b45";
  const reviewId = "674efbf592aecea4bd38bbc7";
  if (!updatedReview || typeof updatedReview !== 'number') {
    return res.status(400).send({ msg: 'Error' });
  }

  try {
     const findReview = Review.findOne({userId})
     if(!findReview){
      return res.status(400).send({msg : "No reviews found"})
     }
    const updateReview = await Review.findById( reviewId , {review : updatedReview } , {new : true})

    if (!updateReview) {
      return res.status(404).send({ msg: ' Error in updating.' });
    }

    return res.status(200).send({ msg: 'Review updated Successfully!' +  updateReview });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: 'There was an error adding your review.' });
  }
};

// purchase the course which user wants 
const purchaseCourse = async (req, res) => {
  const courseId = "674c33e69f445a3f969f461e"; 
  const userId = req.user._id
  const findCourse = await Course.findById(courseId); 
  try{

    if(!findCourse){
      return res.status(400).send({ msg : "Course not found"})
    }
  
  const purchaseCourse = await User.findByIdAndUpdate( userId, {
    $push : { purchaseCourse: {course : courseId}}}, 
    {new : true}
  )
  
  if(purchaseCourse){
    return res.status(200).send({ msg : "Course purchased Successfully"})
  }else{
    return res.status(400).send({ msg : "There is some error"})
  }
  }catch(error){
    console.log(error)
    res.status(500).send({msg : "There is some error in the server please try again later"})
  }
}

// fetching the purchased course
const fetchPurchasedCourse = async (req, res) => { 
  const userId = req.user._id
  try{
  const purchasedCourse = await User.findById( userId, "purchaseCourse" )

  const courseIds = purchasedCourse.purchaseCourse.map(item => new mongoose.Types.ObjectId(item.course))
  // store the course id in the courseId array
  const purchasedCourseDetails = await Course.find({ _id: { $in: courseIds }}, "title duration courseImage"); 

  if(purchasedCourse){
    return res.status(200).send({ msg : purchasedCourse, courseData : purchasedCourseDetails})
  }else{
    return res.status(400).send({ msg : "There is some error"})
  }
  }catch(error){
    console.log(error)
    res.status(500).send({msg : "There is some error in the server please try again later"})
  }
}
module.exports = {addComment, deleteComment, addReview, updateReview, purchaseCourse, fetchPurchasedCourse}