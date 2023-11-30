const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const Product = require("../models/product");

const stripe = require("stripe")(
  "sk_test_51OI9XuSDvaj3CBe9tRkyOj2Ph18rS0LFuckcwSCsTJS5aoLDHz9kKpmuaBrddOl9k7AXew87ONYY0IaXyPHXXQV600m6FQ4XH6"
);


router.get("/user/cart", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart");
  const totalAmount = user.cart.reduce((sum,curr)=>sum + curr.selling_price,0);
  // console.log(user);
  req.flash('success', 'Product added successfully');
  res.render("cart/cart_table", { user ,totalAmount});
});

router.get("/user/checkout", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart");
  const totalAmount = user.cart.reduce((sum,curr)=>sum + curr.selling_price,0);
  // console.log(user);
  res.render("cart/checkout", { user ,totalAmount});
});

router.post("/user/:id/checkout", isLoggedIn, async (req, res) => {
  const {id} = req.params;
  const product = await Product.findById(id);
  const totalAmount = product.selling_price;
  // console.log(user);
  res.render("cart/direct_buy", {product,totalAmount});
});

router.get('/checkout/payment',(req,res)=>{
  res.render('cart/payment');
})

router.post('/checkout/payment/:amount',async(req,res)=>{

  const {first_name,last_name,phone,email,address,city,state,postal_code} = req.body;
  console.log(req.body);
  // console.log(first_name + " " + last_name + " " + phone + " " + email + " " + address + " " + city + " " + state + " " + postal_code);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "INR",
          product_data: {
            name: "all items",
          },
          unit_amount: req.params.amount * 100,
        },
        quantity: "1",
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    mode: "payment",
    success_url: "http://localhost:8080/products",
    cancel_url: "http://localhost:8080/products",
  });
  res.redirect(303, session.url);
  // res.render("cart/payment");
});

router.get('/checkout/payment/order',(req,res)=>{
  res.render('cart/order');
})

router.delete('/user/:userid',async (req, res) => {
    
  try {
      const { userid } = req.params;
      const {cartid} = req.query;
      // console.log(cartid);

      let user = await User.findById(userid).populate('cart');
      console.log("Cart Array : " + user.cart.length);

      let Array = [];
      for( let cart of user.cart){
        if(cart._id != cartid){
          Array.push(cart);
        }
      }
      user.cart = Array;
      user.save();
      console.log("Filtered Array :" + Array.length);

      console.log(user);
      req.flash('success','Product Deleted Succeddfully!')
      res.redirect('/user/cart');
  }
  catch (e) {
      res.status(500).render('error',{err:e.message})   
  }
});


router.post("/user/:productid/add", isLoggedIn, async (req, res) => {
  const { productid } = req.params;
  console.log(productid);
  const userid = req.user._id;
  const product = await Product.findById(productid);
  const user = await User.findById(userid);
  user.cart.push(product);
  user.save();
  res.redirect("/user/cart");
});






module.exports = router;