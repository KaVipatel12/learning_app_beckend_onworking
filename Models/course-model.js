const mongoose = require('mongoose');

// Chapter Schema
const chapterSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: false },
    videos: [
        {
            title: { type: String, required: false },
            videoUrl: { type: String, required: false },
            previewLink: { type: String } // Optional
        }],
    comment:[
          {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
    ],
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
});

// Course Schema with reference to Chapter model
const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, 
    level: { type: String, required: true },
    courseImage: { type: String, required: false },
    language: { type: String, required: true },
    syllabus: { type: String },     
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
    chapters: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'} 
    ],
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, 
    date: { type: Date, default: Date.now }
});

const Chapter = mongoose.model('Chapter', chapterSchema);
const Course = mongoose.model('Course', courseSchema);
module.exports = { Chapter, Course };
