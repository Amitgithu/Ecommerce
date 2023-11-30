const mongoose = require("mongoose");
const Review = require('./review');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    trim: true,
    required:true,
  },
  price: {
    type: Number,
    min: 0,
    default: 50,
    required: true,
  },
  selling_price: {
    type: Number,
    min: 0,
    default: 50,
    required: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  category:{
    type:String,
    trim:true,
    required:true
  },
  color:{
    type:String,
    trim:true
  },
  avgRating: {
    type: Number,
    default:0 
  },
  author :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  discount :{
    type:String,
    trim:true,
    required:true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});


// Mongoose middleware function to delete all the associated reviews on a product
productSchema.post('findOneAndDelete',async function(product) {
    if (product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
