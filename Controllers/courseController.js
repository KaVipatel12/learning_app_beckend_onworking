const {Course} = require("../Models/course-model")
const {Chapter} = require("../Models/course-model")
const Review = require("../Models/review-model")

// Fetch all the courses or the specific searched course using regex, It is used on home page and searched page
const fetchCourses = async (req, res) => {
  try {
      // Extract page, limit, courseName, provider, and category from query parameters
      const { page = 1, limit = 10, courseName, provider, category, price } = req.query;

      // Convert page and limit to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * limitNumber;

      // Build the query object for fetching courses
      let query = {};

      // Filter by courseName if provided
      if (courseName) {
          query.title = new RegExp(courseName, 'i'); // case-insensitive search for course name
      }

      // Filter by provider if provided
      if (provider) {
          query.provider = new RegExp(provider, 'i'); // case-insensitive search for provider
      }

      // Filter by category if provided
      if (category) {
          query.category = new RegExp(category, 'i'); // case-insensitive search for category
      }
      if (price) {
        query.price = { $lte: parseInt(price) }; // Fetch courses with price less than or equal to the specified value
    }

      console.log(query)
      // Fetch the data with pagination and optional filters
      const courseData = await Course.find(query, "title price provider courseImage category")
          .skip(skip)
          .limit(limitNumber);

      // Check if data is found
      if (!courseData.length) {
          return res.status(404).send({ msg: "No courses found" });
      }

      // Format course data and include the image path
      const coursesWithImage = courseData.map(courses => {
        return {
            ...courses.toObject(), 
            courseImage : `/uploads/${courses.courseImage}`
        }
      });

      // Send the paginated data
      res.status(200).send({ msg: coursesWithImage, currentPage: pageNumber });
  } catch (error) {
      // Handle any server errors
      res.status(500).send({ msg: "Server error", error: error.message });
  }
};

// fetch specific course details which is present in the course database.  
const fetchCourseMainPage = async (req, res) => {
    try {
      
      const courseId = req.params.courseId; 
      const courseData = await Course.findById(courseId)  

      if (!courseData || courseData.length === 0) {
        return res.status(404).send({ msg: "No courses found" });
      }

      const courseDataWithImage = {
            ...courseData.toObject(), 
            courseImage : `/uploads/${courseData.courseImage}`
        }
      
      res.status(200).send({ msg: courseDataWithImage });
    } catch (error) {
      res.status(500).send({ msg: "Server error", error: error.message });
    }
};

// fetch all the chapters of the specific course present in the database  
const fetchChaptersMainPage = async(req, res) => {
  const courseId = req.params.courseId;

  try{
    const chapters = await Chapter.find({courseId}, "title courseId")

      console.log(chapters)
      if(!chapters){
        return res.status(400).send({msg : "Chapters not added"})
      }
      return res.status(200).send({msg : chapters})
    }catch(error){
      return res.status(500).send({msg : "Internal servor error"})
    }
}

// fetch specific chapter details which is present in the database 
const fetchChapters = async(req, res) => {
  const chapterId = req.params.chapterId;
  console.log(chapterId)
  try{

    const chapters = await Chapter.findById(chapterId).populate({
      path: 'comment',           
      populate: {
        path: 'userId',          
        select: 'name email'
      }
    })

      if(!chapters){
        return res.status(400).send({msg : "Chapters not added"})
      }
      return res.status(200).send({msg : chapters})
    }catch(error){
      return res.status(500).send({msg : "Internal servor error"})
    }
}

// fetch all the comments of specific chapter
const fetchChapterComments = async (req, res) => {
    const chapterId  = req.params.chapterId;  
  
    try {
      const chapter = await Chapter.findById(chapterId)
      .populate({
        path: 'comment', // Populate the comment field in the chapter
        model: 'Comment', // Specify the Comment model
        select: 'comment userId createdAt', // Specify the fields you want from the Comment model
        populate: {
          path: 'userId', // Populate the userId field within each comment
          model: 'User', // Specify the User model
          select: 'username email', // Specify the fields you want from the User model
        },
      });
  
      if (!chapter) {
        return res.status(404).send({ msg: "Chapter not found" });
      }

      return res.status(200).send({
        msg: "Comments fetched successfully",
        comments: chapter.comment  // Return the comments associated with this chapter
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ msg: "An error occurred while fetching comments" });
    }
};

// fetching the review of all students and display the average review.
const fetchAllReviews = async (req, res) => {

  const courseId = req.params.courseId; 

  try {
    // Find the review for the course by the specific user
    const courseReview = await Review.findOne({courseId}, "reviews");
    if (!courseReview) {
      return res.status(404).json({ message: "No reviews found for this course." });
    }
    console.log(courseReview)
    const reviewArray = []
    courseReview.reviews.forEach(course => {
      reviewArray.push(course.stars)
    })
    
        console.log(reviewArray)
    const addReviews = reviewArray.reduce((acc, curr) => acc + curr , 0);   // Reducing the array in sum of all array elements
    const averageReview = addReviews/ (reviewArray.length)     // Taking the average of reviews. 
    const formattedAverage = averageReview.toFixed(1);         // Only one number after decimal point   eg. 3.22123 => 3.2
    res.status(200).send({ msg : formattedAverage });

} catch (error) {
  console.log(error)
   return res.status(500).send({ msg: "Error" });
}
};

module.exports = {fetchChapterComments, fetchChapters, fetchChaptersMainPage, fetchCourseMainPage, fetchCourses, fetchAllReviews}
