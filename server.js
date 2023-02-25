///////////////////////////////
// Dependencies
////////////////////////////////
const express = require('express');
const mongoose = require('mongoose');
//CORS is a security mechanism that allows web applications to make cross-origin requests, to prevent web apps from making unauthorized requests to different domains.
const cors = require('cors');
//Morgan is a logging middleware that helps developers track HTTP requests and responses in their web apps
const morgan = require('morgan');
// create application object
const app = express();

///////////////////////////////
// Application Settings
////////////////////////////////
require('dotenv').config();

const { PORT, DATABASE_URL } = process.env;

///////////////////////////////
// Database Connection
////////////////////////////////
mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL);
// Mongo connection Events
mongoose.connection
.on('open', ()=> console.log('You are connected to MongoDB'))
.on('close', ()=>console.log('You are disconnected from MongoDB'))
.on('error', (error)=> console.log(`MongoDB Error:${error.message}`));

///////////////////////////////
// Models
////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
}, {timestamps: true});

const People = mongoose.model('People', PeopleSchema);

///////////////////////////////
// Mount Middleware
////////////////////////////////
app.use(express.json());//allow us to receive json on our post request
app.use(morgan('dev'));
app.use(express.json());

///////////////////////////////
// Mount Routes
////////////////////////////////

// create a test route
app.get('/', (req, res) => {
  res.send('hello world');
});

//Index Route
//"async" allows the function to use "await" to wait for the People.find({}) method to complete before continuing to execute the rest of the code in the function
app.get('/people', async (req, res)=> {
    //error handling in Node.js
    //try-catch block: to handle any errors that may occur during the asynchronous await People.find({}) call
    //If call succeeds, the server will return a JSON response with a 200 OK status code and the retrieved records in the response body
    try{
        res.status(200).json(await People.find({}));
    } catch(error){
        res.status(400).json({message: 'something went wrong'});
    }
    //If call fails, the catch block will handle the error and send a JSON response with a 400 Bad Request status code and an error message in the response body
})

//Create Route
app.post('/people', async (req, res)=>{
    try {
        res.status(201).json(await People.create(req.body));
      } catch (error) {
        res.status(400).json({ message: "something went wrong" });
      }
})

//Delete Route
app.delete('/people/:id', async (req, res) => {
    try {
      res.status(200).json(await People.findByIdAndDelete(req.params.id));
    } catch (error) {
      res.status(400).json({ message: "something went wrong" });
    }
  });

//Update Route
app.put('/people/:id', async (req, res) => {
    try {
      res.status(200).json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json({ message: "something went wrong" });
    }
  });

//Show Route
app.get('/people/:id', async (req, res) => {
    try {
      res.status(200).json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json({ message: "something went wrong" });
    }
  });


///////////////////////////////
// Tell the app to listen
////////////////////////////////
app.listen(PORT, () => {
  console.log(`Express is listening on port: ${PORT}`);
});