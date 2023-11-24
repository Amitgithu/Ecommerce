

/* Middleware functions are functions that have access to the request object (req), the response object (res), and 
  the next middleware function in the application’s request-response cycle. The next middleware function is commonly 
  denoted by a variable named next. */

/*
    Middleware functions can perform the following tasks:

    1. Execute any code.
    2. Make changes to the request and the response objects.
    3. End the request-response cycle.
    4. Call the next middleware function in the stack.

*/

/* Note : if the current middleware function does not end the request-response cycle, it must call next() to pass control to the 
next middleware function. Otherwise, the request will be left hanging . */


const express = require('express');
const app = express();


app.use((req, res, next) => {
    console.log('My First Middleware');
    // ....code to get executed
    req.username = 'Sabeel';    // Make changes to the request and the response objects.
    next(); // Call the next middleware function in the stack. => Call the My Second Middleware

    console.log('First Middleware after calling next()'); 
    /* This line is also executed after calling next() as this function is not executed completly 
    so when the control come back then after the next() function all the remaning code will get executed. */

});


app.use((req, res, next) => {
    console.log('My Second Middleware');
    // res.send('HIJACKED BY MY SECOND MIDDLEWARE'); // End the request-response cycle by sending HTTP request
    next();
})

const verify = (req, res, next) => {
    const { password } = req.query
    
    if (password !== 'orange') {
        return res.send('Invalid Password');
    }
    
    next();  // => Call the get request at (/) middleware function
}

// app.get('/',(req,res,next)) => it is also a middleware function as it also contains req, res, next

app.get('/',(req,res)=>{ // it is also 

    res.send('Home Route');
});


// app.get('/cat',verify,(req, res) => it indicate that when we request to /cat it will run the verify middleware (protecting this path)
 
app.get('/cat',verify,(req, res) => {

    const { username } = req;

    console.log(username);

    res.send('Meeooww');
});


app.get('/secret',verify,(req, res) => {
    
    res.send('My Secret is : Sometime i wear the headphones so that i dont have to talk in public');
})



app.listen(2323, () => {
    console.log('server running at port 2323');
})
