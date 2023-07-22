const express = require('express');
const Joi = require('joi');
const genres = require('./genres');

const app = express();
app.use(express.json());

// index route
app.get('/', (req, res) => {
    res.send("Welcome to Vidly Rentials.")
})


// get all genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});


// get a particular genre
app.get("/api/genres/:id", (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("Genre does not exit!");

    res.send(genre);
});


// add new genre
app.post('/api/genres/', (req, res) => {
    const {error} = validateGenre(req.body.genre)
    if (error) return res.status(400).send(error.details[0].message);

    const existingGenre = genres.find(g => g.genre === req.body.genre);
    if (existingGenre) return res.status(400).send("Genre already exist.");

    const genre = {
        id: genres.length + 1,
        genre: req.body.genre
    }

    genres.push(genre);
    res.send({
        id: genre.id,
        genre: genre.genre,
        message: "Successfully added"
    })
})



// update a genre
app.put("/api/genres/:id", (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("Genre does not exist.");

    const {error} = validateGenre(req.body.genre);
    if (error) return res.status(400).send(error.details[0].message);

    const existingGenre = genres.find(g => g.genre === req.body.genre);
    if (existingGenre) return res.status(400).send("Genre already exist.");

    genre.genre = req.body.genre;
    res.send({
        id: genre.id,
        genre: genre.genre,
        message: "genre updated."
    })
});


// delete a genre
app.delete("/api/genres/:id", (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("Genre does not exit.");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send({
        id: genre.id,
        genre: genre.genre,
        message: "Deleted."
    })
});



// function for validating user input
function validateGenre(genre){
    const schema = Joi.object({
        "genre name": Joi.string().min(3).required()
    });

    return schema.validate({"genre name": genre})
}

const port = process.env.PORT || 2077;
app.listen(port, () => console.log(`Listening to port http://localhost:${port}`));
