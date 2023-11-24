const express = require("express");
const Product = require('../models/Product')
const Review = require('../models/Review')
const router = express.Router()  //mini application/instance

router.post('/products/:id/review',async (req, res)=>{
    let{id} = req.params;
    let{rating, comment} = req.body;

    let product = await Product.findById(id);
    let review = new Review({rating, comment}); // javascript method 
    // Review consists of ObjectId, rating, comments

    product.reviews.push(review); // javascript method 
    // Important : mongoose internally find the id from the review and add it to the reviews array

    await product.save();
    await review.save(); // We need to save it as it is not a mongoose method .

    let foundProduct = await Product.findById(id).populate('reviews'); 
    // On finding the Product we populate the reviews array also so it just replace the reviews array id with the 
    // actual review store in the Review Collections
    
    console.log(foundProduct);
    res.render('products/show' , {foundProduct})
})  

// export so that you can use in app.js
module.exports = router;
