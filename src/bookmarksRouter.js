const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bookmarks = require('./bookmarks');

//***Write a route handler for the endpoint GET /bookmarks that returns a list of bookmarks
router.get('/bookmarks', (req, res) => {
    res.send(bookmarks);
})

//***Write a route handler for the endpoint GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid
router.get('/bookmarks/:id', (req, res) => {
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

router.post('/bookmarks', (req, res, next) => {
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

router.delete('/bookmarks/:id', (req, res) => {
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

module.exports = router;