//Use the boilerplate to start a new application named bookmarks-server*****
//Configure logging and API key handling middleware on the server*****

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bookmarks = require('./bookmarks')
const uuid = require('uuid')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());

//Validate Authorization
app.use( function validateBearerToken (req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

//***Write a route handler for the endpoint GET /bookmarks that returns a list of bookmarks
app.get('/bookmarks', (req, res) => {
    res.send(bookmarks);
})

//***Write a route handler for the endpoint GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid
app.get('/bookmarks/:id', (req, res) => {
    //create variable for  id
    const { id } = req.params;

    //set variable that finds a matching id in the dataset (bookmarks)
    const index = bookmarks.findIndex( u => u.id === id)

    //make sure we have a corresponding id available
    if(index === -1){
        return res
            .status(404)
            .send('Bookmark not found')
    }
    res
        .json(bookmarks[index]);
})

//***Write a route handler for POST /bookmarks that accepts a JSON object representing a bookmark and adds it to
//the list of bookmarks after validation.

app.post('/bookmarks', (req, res, next) => {
    //get the data for a new bookmark
    const {bookmark, chapter, booktitle, page} = req.body
    console.log("ReqBody: ",req.body);
    //validate that all feilds are given
    if(!bookmark){
        return res
            .status(400)
            .send("bookmark required")
    }
    if(!chapter){
        return res
            .status(400)
            .send("chapter required")
    }
    if(!booktitle){
        return res
            .status(400)
            .send("booktitle required")
    }
    if(!page){
        return res
            .status(400)
            .send("page required")
    }

    //created new ID for bookmark
    const id = uuid()

    //creates new entry to bookmarks array
    const newbookmark ={
        id,
        bookmark,
        chapter,
        booktitle,
        page
    };

    bookmarks.push(newbookmark);

    res
        .location(`http://localhost:8000/user/${id}`)
        .json(bookmarks);
});

//Write a route handler for the endpoint DELETE /bookmarks/:id that deletes the bookmark with the given ID.

app.delete('/bookmarks/:id', (req, res) => {
    const {id} = req.params;

    //Filter through bookmarks to see if the id in the params matches an id in the object
    const index = bookmarks.findIndex( u => u.id === id);

    //validate that the user id exists in the object
    if(index === -1){
        return res
            .status(404)
            .send('Bookmark not found');
    }
    bookmarks.splice(index,1);
    res
        .json(bookmarks)
})



//Error handler for middleware (give user back a clean looking error)
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app