const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { validateProduct ,isLoggedIn, isSeller,isProductAuthor} = require('../middleware');
const User = require('../models/user');

router.get('/products', async (req, res) => {
    
    try {
        const product_men = await Product.find({category:'Men'}).limit(8);
        const product_women = await Product.find({category:'Women'}).limit(8);
        const product_shoe = await Product.find({category:'Shoes'}).limit(8);
        const product_electronic = await Product.find({category:'Electronics'}).limit(8);
        res.render('products/home', { product_men,product_women,product_shoe,product_electronic });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});

router.get('/filter',async(req,res)=>{
    const product = await Product.find();
    res.render('products/filter',{product});
})

router.get('/filter/products',async(req,res)=>{
    const query = {};

  if (req.query.category) {
    query.category = {$in: req.query.category};
  }

  if (req.query.price) {
    query.price = { $lte: parseInt(req.query.price) };
  }

  if (req.query.color) {
    query.color = { $in: Array.isArray(req.query.color) ? req.query.color : [req.query.color] };
  }

  if (req.query.rating) {
    query.rating = { $gte: parseFloat(req.query.rating) };
  }

  console.log(query);
  const product = await Product.find(query);

  console.log(product);

  
  res.render('products/filter',{product});
})


router.get('/products/new', isLoggedIn, (req, res) => {

    try {
        res.render('products/new');
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }  
});

router.post('/products',isLoggedIn,isSeller,validateProduct,async (req, res) => {
    
    try {
        console.log(req.body);
        const { name, image, desc, price,selling_price,category,discount } = req.body;
        await Product.create({ name, image, price: parseFloat(price),selling_price: parseFloat(selling_price),author:req.user._id, desc,category,discount });
        req.flash('success','Product Added SuccessFullyyyyy!!!');
        // console.log('hi2');
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
});

router.get('/products/seller_products',isLoggedIn,async (req,res)=>{
    let name = req.user.username;
    let user_details =  await User.find({username:name})
    console.log(user_details);

    let user_id = user_details[0]._id;
    console.log(user_id);

    console.log("Populate Author");
    const products = await Product.find().populate('author');

    let product = [];

    for(let item of products){
        if (item.author){
            console.log(item.author._id);
            if(item.author._id.equals(user_id)){
                product.push(item);
            }
        }
    }
    console.log(product);
    res.render('products/seller_product',{product});
})

router.get('/products/:id', async (req, res) => {


    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('reviews');

        // console.log(author);
        res.render('products/detail', { product }); 
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});

router.get('/products/:id/Quick', async (req, res) => {


    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('reviews');
        res.render('products/quick_view', { product }); 
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});


router.get('/products/:id/edit',isLoggedIn,isProductAuthor, async (req, res) => {
    
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        res.render('products/edit', { product });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }  
});

router.patch('/products/:id',validateProduct,isLoggedIn,isProductAuthor,async (req, res) => {
    

    try {
        const { id } = req.params;
        const { name, price, image, desc,selling_price,category,discount } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, desc, image,category,selling_price,discount });
        req.flash('success','Product Editted SuccessFully!!!')
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
        
    } 
});


router.delete('/products/:id', isLoggedIn,isProductAuthor,async (req, res) => {
    
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        req.flash('success','Product Deleted Succeddfully!')
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})   
    }
});



module.exports = router;