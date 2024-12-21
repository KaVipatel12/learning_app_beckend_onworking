const Provider = require("../Models/provider-model")
const {Course} = require("../Models/course-model")
const {Chapter} = require("../Models/course-model");
const { fetchCourses } = require("./courseController");
const { lineTo } = require("pdfkit");

// Fetching the courses that Educator has
const fetchProviderCourses = async(req, res) => {
    const providerId = req.provider._id; 
  try{
      const fetchDetails = await Provider.findById(providerId, "courses"); 

      const courseIds = fetchDetails.courses.map(ids => ids)
      let fetchCourse;
      if(courseIds.length > 0){
          fetchCourse = await Course.find({"_id" : {$in : courseIds}}, "title price duration courseImage")
      }

      if(!fetchDetails){
          return res.status(400).send({msg : "Login to view the profile"})
      }
      
      const coursesWithImage = fetchCourse.map(courses => {
        return {
            ...courses.toObject(), 
            courseImage: `/uploads/${course.courseImage.replace(/\\/g, '/')}`,
        }
      })
      return res.status(200).send({msg : fetchDetails , courses : coursesWithImage})
  }catch(error){
      res.status(500).send({msg : "Error"})
  }
}

const fetchProviderCourseMainPage = async (req, res) => {
    try {
      
        const providerId = req.provider._id; 
        const courseId = req.params.courseId; 
        const courseData = await Course.findById(courseId)  
  
        if (!courseData || courseData.length === 0) {
          return res.status(404).send({ msg: "No courses found" });
        }
  
        res.status(200).send({ msg: courseData });
      } catch (error) {
        res.status(500).send({ msg: "Server error"});
      }
};

const fetchProviderChapters = async(req, res) => {
    const courseId = req.params.courseId;
  
    try{
      const chapters = await Chapter.find({courseId}, "title")
  
        console.log(chapters)
        if(!chapters){
          return res.status(400).send({msg : "Chapters not added"})
        }
        return res.status(200).send({msg : chapters})
      }catch(error){
        return res.status(500).send({msg : "Internal servor error"})
        // this is fetching the course.
      }
}
  
  // fetch specific chapter details which is present in the database 
  const fetchProviderChapterMainPage = async(req, res) => {
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

// Add the course by the provider, Adding the course details which is stored in the Course model
const courseAddPage = async (req, res) => {
    console.log(req.body)
    const { title, description, category, price, duration, level, language } = req.body; // Removed courseImage from req.body
    const providerId = req.provider._id;

    try {
        // Check if file is uploaded
        const courseImage =  req.file ? req.file.filename : null;
        // Step 1: Create the course
        const newCourse = await Course.create({
            title,
            description,
            category,
            price,
            duration,
            level,
            courseImage, // Store the file path
            language,
            provider: providerId
        });

        // Step 2: Add the course to the provider's courses array
        const updatedProvider = await Provider.findByIdAndUpdate(
            providerId,
            { $push: { courses: newCourse._id } }, // Push the course ID
            { new: true, useFindAndModify: false }
        ).populate('courses'); // Populate to show the updated courses list

        if (updatedProvider) {
            res.status(200).send({ msg: "Course Added", updatedProvider });
        } else {
            res.status(400).send({ msg: "Provider not found or update failed" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
};

// Update the course by the provider, Updating the course details which is stored in the Course model
const courseUpdatePage = async (req, res) => {
    const { title, description, category, price, duration, level, language} = req.body;
    const providerId = req.provider._id
    const courseId = req.params.courseId; 
    try {
        // Step 1: Create the course
        const updateCourse = await Course.findByIdAndUpdate( courseId ,{
            title,
            description,
            category,
            price,
            duration,
            level,
            language, 
        }, {new : true});
        
        if (updateCourse) {
            res.status(200).send({ msg: "Course Updated", updateCourse });
        } else {
            res.status(400).send({ msg: "Provider not found or update failed" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
    
};

// Delete the course by the provider, Deleting the course details which is stored in the Course model
const courseDeletePage = async (req, res) => {
    const providerId = req.provider._id;
    const courseId = req.params.courseId;  // This should ideally come from req.params or req.body

    try {
        const deleteCourse = await Course.findByIdAndDelete(courseId);

        if (!deleteCourse) {
            return res.status(400).send({ msg: "Course Not found" });
        }

        const deleteChapters = await Chapter.deleteMany({ courseId: deleteCourse._id });

        const updatedProvider = await Provider.findByIdAndUpdate(
            providerId,
            { $pull: { courses: deleteCourse._id } },  // Remove course ID from provider's courses
            { new: true, useFindAndModify: false }
        ).populate('courses');  // Populate to show the updated courses list

        if (updatedProvider) {
            return res.status(200).send({ msg: "Course and its chapters deleted successfully", updatedProvider });
        } else {
            return res.status(400).send({ msg: "Provider not found or update failed" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
};

// Add the chapters in the course by the provider, Adding the chapters details which is stored in the chapter model
const chapterAddPage = async (req, res) => {
    const chapters = req.body ? JSON.parse(req.body.chapters) : []; // Parse chapters from request body
    const courseId = req.params.courseId;
    try {
        if (!chapters || chapters.length === 0) {
            return res.status(400).send({ msg: "No chapters provided" });
        }

        const newChapters = [];

        // Iterate over chapters and create each one with its corresponding video
        for (let i = 0; i < chapters.length; i++) {
            const { title, description, videoUrl } = chapters[i];

            const newChapter = await Chapter.create({
                title,
                description,
                videoUrl,
                courseId,
            });

            newChapters.push(newChapter);
        }

        // Add the created chapters to the course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { chapters: { $each: newChapters.map(ch => ch._id) } } },
            { new: true, useFindAndModify: false }
        ).populate('chapters');

        if (updatedCourse) {
            res.status(200).send({ msg: "Chapters added successfully", updatedCourse });
        } else {
            res.status(400).send({ msg: "Error adding chapters to the course" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
        console.error(error);
    }
};

// Delete a chapter in the course by the provider, Delete a chapter details which is stored in the chapter model
const chapterDeletePage = async (req, res) => {
    const chapterId = req.params.chapterId; 
    const courseId = req.params.courseId;
    
    try {
      const deletedChapter = await Chapter.findByIdAndDelete(chapterId);
      
      if (!deletedChapter) {
        return res.status(404).send({ msg: 'Chapter not found' });
      }
    
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $pull: { chapters: chapterId } },  
        { new: true }  
      ).populate('chapters'); 
    
      if (!updatedCourse) {
        return res.status(400).send({ msg: 'Course not found or failed to update course' });
      }
    
      res.status(200).send({ msg: 'Chapter deleted and course updated', updatedCourse });
    
    } catch (error) {
      res.status(500).send({ msg: 'Internal server error' });
    }
    
    
};

// Update a chapter in the course by the provider, Update a chapter details which is stored in the chapter model
const chapterUpdatePage = async (req, res) => {
    const { title, description, videos} = req.body;
    const chapterId = req.params.chapterId; 
    try {
        // Step 1: Create the course
        const updateChapter = await Chapter.findByIdAndUpdate( chapterId ,{
            title, description, videos
        }, {new : true});
        
        if (updateChapter) {
            res.status(200).send({ msg: "Chapter Updated successfully", updateChapter });
        } else {
            res.status(400).send({ msg: "Provider not found or update failed" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
    
};

module.exports = {courseAddPage, courseUpdatePage, courseDeletePage, chapterAddPage, chapterDeletePage, chapterUpdatePage, fetchProviderCourses, fetchProviderCourseMainPage, fetchProviderChapterMainPage,fetchProviderChapters }
  