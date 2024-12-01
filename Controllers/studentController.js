const User = require("../Models/user-model")
const Provider = require("../Models/provider-model")
const {Course} = require("../Models/course-model")

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
  
module.exports = {fetchAllCourses}