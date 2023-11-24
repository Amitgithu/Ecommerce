const mongoose = require('mongoose');

// creating product schema
let productSchema = new mongoose.Schema({
    name: {
        type : String,
        trim : true,
        required : true
    },
    img: {
        type : String,
        trim : true
    },
    price: {
        type : Number,
        min : 0,
        required : true
    },
    desc: {
        type : String,
        trim : true
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

// Calling pre() or post() after compiling a model does not work in Mongoose in general.
productSchema.pre('findOneAndDelete',async function(data) {
    console.log(data);
}); 

// Mongoose middleware function to delete all the associated reviews on a product
productSchema.post('findOneAndDelete',async function(product) {
    if (product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});

// Note : Here product contain the deleted product and async is important here without it it will not work.
//        Here pre and post are the middleware function which will run when the findByIdAndDelete function will executed.
//        findOneAndDelete are the middleware function which will run when the findByIdAndDelete function will executed.

// creating model
let Product = mongoose.model('Product' , productSchema )

module.exports = Product; //sending the model to be used anywhere when required

/*
This exports the Product model so that it can be used in other files. This allows you to interact with the products collection 
in your MongoDB database using this model. */