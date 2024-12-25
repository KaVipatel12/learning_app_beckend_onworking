const User = require("../Models/user-model")
const {Chapter} = require("../Models/course-model")
const {Course} = require("../Models/course-model")
const Review = require("../Models/review-model")
const Comment = require("../Models/comments-model")
const Cart = require("../Models/cart-model")
const mongoose = require("mongoose")
// Add the comment by the user. 
const addComment = async(req, res) => {
  const {comment} = req.body;
  const chapterId = req.params.chapterId;
  const userId = req.user._id; 
  
  console.log("this is the comment:" + comment)

  try{
  const inputComment = await Comment.create({
    comment, chapterId, userId
  }) 
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
  console.log("Comment added")
  return res.status(200).send({msg : "Comment added"},   updatedChapter, 
    updatedUser)
  }catch(error){
    console.log(error)
}
}

// delete the comment by the user. 
const deleteComment = async (req, res) => {
  const commentId = req.params.commentId; 
  const chapterId = req.params.chapterId; 
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

// fetching all the comments of a particular user. 
const fetchComment = async (req, res) => {
  const userId = req.user._id; 
  try{
    const fetchDetails = await User.findById(userId, "comment"); 
    const commentIds = fetchDetails.comment.map(ids => ids)
    let fetchComments;
    if(commentIds.length > 0){
      fetchComments = await Comment.find({"_id" : {$in : commentIds}}, "comment")
    }

    if(!fetchDetails){
        return res.status(400).send({msg : "Login to view the profile"})
    }
    
    return res.status(200).send({msg : fetchComments})
}catch(error){
  console.log(error)
    res.status(500).send({msg : "Error"})
}
  
}
// Adding the course review by the users who are enrolled in it
const addOrUpdateReview = async (req, res) => {
  const { stars } = req.body; // Get the stars from the request body
  const courseId = req.params.courseId; // Get the courseId from params
  const userId = req.user._id; // Get the userId from authenticated user

  try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send({ message: "User not found." });
      }

      // Check if the user has purchased the course
      const hasPurchased = user.purchaseCourse.some(purchase => purchase.course.toString() === courseId);
      if (!hasPurchased) {
          return res.status(403).json({ message: "You can only review courses you have purchased." });
      }

      // Find the review document for the course
      let courseReview = await Review.findOne({ courseId });
      let existingReview = null; // Define existingReview in a broader scope

      if (!courseReview) {
          // If no review document exists, create a new one
          courseReview = new Review({
              courseId,
              reviews: [{ userId, stars }]
          });
      } else {
          // Check if the user has already reviewed this course
          existingReview = courseReview.reviews.find(review => review.userId.equals(userId));

          if (existingReview) {
              // Update the existing review
              existingReview.stars = stars;
          } else {
              // Add a new review to the reviews array
              courseReview.reviews.push({ userId, stars });
          }
      }

      // Save the review document
      const updatedReview = await courseReview.save();

      return res.status(201).json({
          msg: existingReview ? "Review updated successfully." : "Review added successfully.",
          courseReview
      });

  } catch (error) {
      console.error("Error in addOrUpdateReview:", error);
      return res.status(500).send("There was an error processing your request.");
  }
};

// Fetching the review of a particular student.
const fetchReview = async (req, res) => {
  
  const courseId = req.params.courseId; 
  const userId = req.user._id
  try {
    // Find the review for the course by the specific user
    const courseReview = await Review.findOne({ courseId });

    if (!courseReview) {
        return res.status(404).json({ message: "No reviews found for this course." });
    }

    // Find the specific review for the user
    const userReview = courseReview.reviews.find(review => review.userId.equals(userId));

    if (!userReview) {
        return res.status(404).json({ message: "User has not reviewed this course." });
    }

    // Return the user's review
    res.status(200).json({ userReview });
} catch (error) {
  return res.status(500).send({ msg: 'There was an error adding your review.' });
}  
};

// Purchase the course which user wants 
const purchaseCourse = async (req, res) => {
  const courseIds = req.body;  // Assume this is an array of courseIds
  const userId = req.user._id; 

  try {
    // Fetch the user to check already purchased courses
    const user = await User.findById(userId);

    // Filter out already purchased courses
    const alreadyPurchasedCourseIds = user.purchaseCourse.map(p => p.course.toString()); 
    const newCourses = courseIds.filter(courseId => !alreadyPurchasedCourseIds.includes(courseId));

    // If no new courses to add, return a message
    if (newCourses.length === 0) {
      return res.status(400).send({ msg: "All courses are already purchased" });
    }

    // If there are new courses to add, push them to the user's purchaseCourse array
    const purchaseCourse = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          purchaseCourse: { 
            $each: newCourses.map(courseId => ({ course: courseId })) 
          } 
        } 
      },
      { new: true }
    );

    return res.status(200).send({ msg: "Courses purchased successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Server error, please try again later" });
  }
};

// Fetching the purchased course
const fetchPurchasedCourse = async (req, res) => { 
  const userId = req.user._id
  try{
  const purchasedCourse = await User.findById( userId, "purchaseCourse" )

  // store the course id in the courseId array
  const courseIds = purchasedCourse.purchaseCourse.map(item => new mongoose.Types.ObjectId(item.course))

  const purchasedCourseDetails = await Course.find({ _id: { $in: courseIds }}, "title duration courseImage"); 

  if(purchasedCourse){
    return res.status(200).send({ msg : purchasedCourseDetails})
  }else{
    return res.status(400).send({ msg : "There is some error"})
  }
  }catch(error){
    console.log(error)
    res.status(500).send({msg : "There is some error in the server please try again later"})
  }
}

// Cart functionality for a particular user
const cartFunctionality = async (req, res) => {
  const courseId = req.params.courseId; 
  const userId = req.user._id; 

  try {
    // Find user cart or create one if not found
    let findUser = await Cart.findOne({ userId });

    if (!findUser) {
      const addCart = await Cart.create({
        userId,
        cartItems: [{ courseId, createdAt: Date.now() }]
      });

      if (addCart) {
        return res.status(200).send({ msg: "Added to the cart" });
      }
    } else {
      // Checking if the course already exists in the cart
      const courseExists = findUser.cartItems.some(item => item.courseId.equals(courseId));

      if (!courseExists) {
        // If the course does not exist, add it to the cart
        findUser.cartItems.push({ courseId, createdAt: Date.now() });
        // Save the updated cart and add the cart ID to the user's cart array
        await findUser.save();
        await User.findByIdAndUpdate(userId, { $push: { cart: findUser._id } });
        return res.status(200).send({ msg: "Added to the cart" });
      } else {
        // If the course exists, remove it from the cart
        findUser.cartItems.pull({ courseId });

        // Save the updated cart and remove the cart ID from the user's cart array
        await findUser.save();
        await User.findByIdAndUpdate(userId, { $pull: { cart: findUser._id } });
        return res.status(200).send({ msg: "Removed from the cart" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Error occurred while processing the cart." });
  }
};

// fetching the cart of the particular user
const fetchCart = async (req, res) => {
  const userId = req.user._id; 

  try {
    // Find user cart or create one if not found
    let findUser = await Cart.findOne({ userId }, "cartItems");

    if (!findUser) {
      res.status(200).send({msg : null})
    } else {
      const courseIds = findUser.cartItems.map(item => item.courseId);
      const cartItems = await Course.find({ '_id' : { $in : courseIds}}, "title price duration category courseImage")
      res.status(200).send({msg : cartItems})
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Error occurred while processing the cart." });
  }
};

module.exports = {addComment, deleteComment, addOrUpdateReview, purchaseCourse, fetchPurchasedCourse, fetchReview, cartFunctionality, fetchCart, fetchComment}