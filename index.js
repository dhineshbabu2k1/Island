var mongoose = require('mongoose');

// make a connection 
mongoose.connect('mongodb+srv://dhineshbabu2k1:madgtptd3@demo.c3yy191.mongodb.net/agan');

// get reference to database
var dba = mongoose.connection;

dba.on('error', console.error.bind(console, 'connection error:'));

dba.once('open', function () {
    console.log("Connection Successful!");

    // define Schema
    var BookSchema = mongoose.Schema({
        name: String,
        price: Number,
        quantity: Number
    });

    // compile schema to model
    var Book = mongoose.model('Book', BookSchema, 'patients');

    // a document instance
    var book1 = new Book({ name: 'Introduction to Mongoose', price: 10, quantity: 25 });

    // save model to database
    book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
    });

});