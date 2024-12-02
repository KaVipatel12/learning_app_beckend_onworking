const Provider = require("../Models/provider-model")
const {Course} = require("../Models/course-model")
const {Chapter} = require("../Models/course-model")


// Add the course by the provider, Adding the course details which is stored in the Course model
const courseAddPage = async (req, res) => {
    const { title, description, category, price, duration, level, language, courseImage } = req.body;
    const providerId = req.provider._id;
    
    try {
        // Step 1: Create the course
        const newCourse = await Course.create({
            title,
            description,
            category,
            price,
            duration,
            level,
            courseImage,
            language, 
            provider: providerId
        });
    
        // Step 2: Add the course to the provider's courses array
        const updatedProvider = await Provider.findByIdAndUpdate(
            providerId,
            { $push: { courses: newCourse._id } },  // Push the course ID
            { new: true, useFindAndModify: false }
        ).populate('courses');  // Populate to show the updated courses list
    
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
    const { title, description, category, price, duration, level, language, courseImage } = req.body;
    const providerId = req.provider._id
    const courseId = "674c184dfa819185c091654a"; 
    try {
        // Step 1: Create the course
        const updateCourse = await Course.findByIdAndUpdate( courseId ,{
            title,
            description,
            category,
            price,
            duration,
            level,
            courseImage,
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
    const courseId = "674c31b8992c7e1bb9bc4685";  // This should ideally come from req.params or req.body

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
    const chapters = req.body; // Array of chapters passed in the request body
    const courseId = "674c33e69f445a3f969f461e";  
    
    try {
        // Step 1: Create the chapters
        
        const newChapters = []
        
        for(let chapter of chapters){
            const { title, description,videos  } = chapter;
            const newChapter = await Chapter.create({
                title,
                description,
                videos,
                courseId
            });

            newChapters.push(newChapter); 
        }
    
        // Step 2: Add the course to the provider's courses array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { chapters: { $each: newChapters.map(ch => ch._id) }}},  // Push the course ID
            { new: true, useFindAndModify: false }
        ).populate('chapters');  // Populate to show the updated courses list
    
        if (updatedCourse) {
            res.status(200).send({ msg: "Course Added", updatedCourse });
        } else {
            res.status(400).send({ msg: "There is some error in the server please try again later" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
    
};

// Delete a chapter in the course by the provider, Delete a chapter details which is stored in the chapter model
const chapterDeletePage = async (req, res) => {
    const chapterId = "674c346a9f445a3f969f4626"; 
    const courseId = "674c33e69f445a3f969f461e";
    
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
      res.status(500).send({ msg: 'Internal server error', error: error.message });
    }
    
    
};

// Update a chapter in the course by the provider, Update a chapter details which is stored in the chapter model
const chapterUpdatePage = async (req, res) => {
    const { title, description, videos} = req.body;
    const chapterId = "674c34afbd0ebc13a6dfe82a"; 
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

module.exports = {courseAddPage, courseUpdatePage, courseDeletePage, chapterAddPage, chapterDeletePage, chapterUpdatePage}
  