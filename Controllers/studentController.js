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
const addReview = async (req, res) => {

  const {stars} = req.body; 
  const courseId = "674c33e69f445a3f969f461e"
  const userId = req.user._id
  try{
    // check if the user has purchased the course or not
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ message: "User not found." });
    }

    // Check if the course is in the user's purchase history
    const hasPurchased = user.purchaseCourse.some(purchase => purchase.course.toString() === courseId);
    
    if (!hasPurchased) {
        return res.status(403).json({ message: "You can only review courses you have purchased." });
    }

    let courseReview = await Review.findOne({courseId})
    if(!courseReview){
      courseReview = new Review({
        courseId,
        reviews: [{ userId, stars }]
    }) 
  }else{
    const existingReview = courseReview.reviews.find(review => review.userId.equals(userId));

            if (existingReview) {
                return res.status(400).json({ message: "You have already reviewed this course." });
            }
           // Add new review to the reviews array
            courseReview.reviews.push({ userId, stars });
        }
        // Save the review document
        await courseReview.save();
        return res.status(201).json({ message: "Review added successfully.", courseReview });
  }
  catch(error){
    return res.status(500).send("There is some error")
  }
};

// Updating the course review 
const updateReview = async (req, res) => {

  const { stars } = req.body; // Get the review from the request body

  const userId = "674d834b98611d382b7c64ac";
  const courseId = "674c33e69f445a3f969f461e"
  try {

    // Find the review document for the course and update the user's review
    const result = await Review.findOneAndUpdate(
        { 
            courseId, // Match the course ID
            "reviews.userId": userId // Match the user in the reviews array
        },
        { 
            $set: { "reviews.$.stars": stars } // Update the stars for the matched user
        },
        { 
            new: true // Return the updated document
        }
    );

    if (!result) {
        return res.status(404).json({ message: "Review not found for this user." });
    }

    res.status(200).json({ message: "Review updated successfully.", result });
} catch (error) {
    res.status(500).json({ message: "Error updating review."});
}   
};

// Fetching the review of a particular student.
const fetchReview = async (req, res) => {
  
  const { stars } = req.body; // Get the review from the request body
  const courseId = "674c33e69f445a3f969f461e"
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
  const courseIds = ["674c33e69f445a3f969f461e"];  // Assume this is an array of courseIds
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
  const courseId = "674c33e69f445a3f969f461e"; // Replace with actual dynamic courseId
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

module.exports = {addComment, deleteComment, addReview, updateReview, purchaseCourse, fetchPurchasedCourse, fetchReview, cartFunctionality, fetchCart, fetchComment}