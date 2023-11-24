const express = require('express');
const Product = require('../models/Product'); // Requring the Product model so that we can work with database
const Review = require('../models/Review');
const router = express.Router(); // mini instance / application;

// READ
router.get('/products' , async (req,res)=>{
    let allProducts = await Product.find(); // returns an array of object
    res.render('products/index' , {allProducts})
})

// SHOW A NEW FORM
router.get('/products/new' , (req,res)=>{
    res.render('products/new');
})

// ACTUALLY ADDING IN THE DATABASE
router.post('/products' , async(req,res)=>{
    let {name,img , price , desc} = req.body;
    await Product.create({name,img , price , desc});
    res.redirect('/products'); // sending GET request at this route
})

// TO SHOW A PARTICULAR PRODUCT
router.get('/products/:id' , async(req,res)=>{
    let {id} = req.params;
    let foundProduct = await Product.findById(id).populate('reviews');
    console.log(foundProduct);
    res.render('products/show' , {foundProduct})

})

// FORM TO EDIT A PARTIICULAR PRODUCT
router.get('/products/:id/edit' , async(req,res)=>{
    let {id} = req.params;
    let foundProduct = await Product.findById(id);
    console.log('sam1',foundProduct,'sam');
    res.render('products/edit' , {foundProduct})
})


// TO ACTUALLY CHANGE IN DB
router.patch('/products/:id' , async(req,res)=>{
    let {id} = req.params;
    let {name , img , price , desc} = req.body;
    await Product.findByIdAndUpdate( id , {name , img , price , desc});
    res.redirect(`/products/${id}`);
})

// DELETE THE EXISTING PRODUCT
router.delete('/products/:id' , async(req,res)=>{
    let {id} = req.params;
    let product = await Product.findById(id);
    for(let id of product.reviews){
        await Review.findByIdAndDelete(id);
    }
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})


// export router, so that you can use it in app.js
module.exports = router;