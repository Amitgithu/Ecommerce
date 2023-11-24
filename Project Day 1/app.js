const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const methodOverride = require('method-override')

// database connection
mongoose.connect('mongodb://127.0.0.1:27017/amit') // returns a promise
.then(()=>{console.log("DB CONNECTED")})
.catch((err)=>{console.log("error in DB" , err)})

// setting templates
app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'));
// setting static files
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true})) // body parsing middleware
app.use(methodOverride('_method')) // method override

// using all the routes in order to verify the path an run the function
app.use(productRoutes);
app.use(reviewRoutes);


/* In the case of app.use(productRoutes);, it means that for any incoming request, Express will first check if the path matches 
// any of the routes defined in productRoutes. If a match is found, 
// it will execute the corresponding handler for that route

1.  A client makes a request to your server, e.g., GET /products.

2. Express receives the request and starts processing it.

3. It first checks the routes defined in the productRoutes router.

4. If productRoutes has a route that matches the path /products (for example), Express will execute the corresponding handler for that route.

5. If there's no match in productRoutes, Express will continue to the next middleware or router defined in your application. */



console.log(seedDB);
// adding dummy data to the collection
// seedDB()

// running on port
const PORT = 8080;
app.listen(PORT , ()=>{
    console.log(`server connected at port: ${PORT}`);
})
