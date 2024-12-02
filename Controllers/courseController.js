const {Course} = require("../Models/course-model")
const {Chapter} = require("../Models/course-model")


// fetch all the courses title and price which is present in the database by infinite scrolling method 
const fetchAllCourses = async (req, res) => {
    try {
      // Extract page and limit from query parameters with default values
      const { page , limit} = req.query;
  
      // Convert page and limit to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * limitNumber;
  
      // Fetch the data with pagination (skip and limit)
      const courseData = await Course.find({}, "title price")
        .skip(skip)
        .limit(limitNumber);
  
      // Check if data is found
      if (!courseData || courseData.length === 0) {
        return res.status(404).send({ msg: "No more courses found" });
      }

      // Send paginated data
      res.status(200).send({ data: courseData, currentPage: pageNumber });
    } catch (error) {
      res.status(500).send({ msg: "Server error", error: error.message });
    }
};

// fetch specific course details which is present in the course database.  
const fetchCourseMainPage = async (req, res) => {
    try {
      
      const courseId = "674c33e69f445a3f969f461e"
      const courseData = await Course.findById(courseId)  

      if (!courseData || courseData.length === 0) {
        return res.status(404).send({ msg: "No more courses found" });
      }

      res.status(200).send({ msg: courseData });
    } catch (error) {
      res.status(500).send({ msg: "Server error", error: error.message });
    }
};

// fetch all the chapters of the specific course present in the database  
const fetchChaptersMainPage = async(req, res) => {
  const courseId = "674c33e69f445a3f969f461e";

  try{
    const chapters = await Chapter.find({courseId}, "title")

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
  const courseId = "674c33e69f445a3f969f461e";

  try{

    const chapters = await Chapter.find({courseId}).populate({
      path: 'comment',           
      populate: {
        path: 'userId',          
        select: 'name email'
      }
    })

      console.log(chapters)
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
    const chapterId  = "674c34afbd0ebc13a6dfe82a";  
  
    try {
      const chapter = await Chapter.findById(chapterId)
        .populate({
          path: 'comment',  // Populate the comment field in the chapter
          model: 'Comment',  // Specify the Comment model
          select: 'comment userId'  // Specify the fields you want from the Comment model
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

module.exports = {fetchAllCourses,  fetchChapterComments, fetchChapters, fetchChaptersMainPage, fetchCourseMainPage}
