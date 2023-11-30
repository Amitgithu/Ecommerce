const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const {validateReview,isLoggedIn} = require('../middleware')

router.post('/products/:productid/review',isLoggedIn, validateReview,async (req,res)=>{

    try{
        const {productid} = req.params;
        const {rating,comment,name,email} = req.body;
        console.log(productid);
        console.log(rating + " " + comment + " " + name + " " + email);

        
        const product = await Product.findById(productid);
        // const review = new Review({...req.body})
        const review = new Review({rating,comment,name,email});
        
        // Average Rating Logic
        const newAverageRating = ((product.avgRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        product.reviews.push(review);
        
        await review.save();
        await product.save();
        
        // console.log(product.reviews);
        req.flash('success','Your Review is Added SuccessFully!!!')
        res.redirect(`/products/${productid}`);
    }

    catch(err){
        console.log("Error");
        res.status(500).render('error',{err:err.message});
    }


});








module.exports = router