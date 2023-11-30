const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: String,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required:true
  },
  email: {
    type: String,
    trim: true,
    required:true
  },
},{timestamps:true});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
