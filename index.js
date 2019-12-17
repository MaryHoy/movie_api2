const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(bodyParser.json());

// Return a list of ALL movies to the user
app.get('/movies', function(req , res){ 
    
  Movies.find()
   .then(function(movies){
      res.status(201).json(movies)
  })
   .catch(function(error){
      console.error(error);
      res.status(500).send("Error: " + error);
  }); 
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:movieId", function(req, res) {
  Users.findOne({ MovieId : req.params.MovieId })
  .then(function(movie) {
    res.json(movie)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

  // Return data about a genre (description) by name/title (e.g., “Thriller”)
  app.get("/movies/genres/:Name", function(req, res) {
      Movies.findOne({ "Genre.Name": req.params.Name })
        .then(function(movies) {
          res.json(movies.Genre);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
      });

// Return data about a director (bio, birth year, death year) by name
  app.get("movies/directors/:name", function(req, res) {
    Movies.findOne({ "Director.Name" : req.params.Name })
  .then(function(movies) {
    res.status(201).json(movies.Director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Allow new users to register
/* We’ll expect JSON in this format
{
 ID : Integer,
 Username : String,
 Password : String,
 Email : String,
 Birthday : Date
}*/
app.post('/users', function(req, res) {
  Users.findOne({ Username : req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

// Allow existing users to deregister
app.delete('/users/:Username', function(req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then(function(user) {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Allow users to update their user info (username, password, email, date of birth)

/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, { $set :
  {
    Username : req.body.Username,
    Password : req.body.Password,
    Email : req.body.Email,
    Birthday : req.body.Birthday
  }},
  { new : true },
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " +err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/Movies/:MovieID', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $push : { FavoriteMovies : req.params.MovieID }
  },
  { new : true },
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:id/:movie_id', (req, res) => {
  let user = Users.find((user) => { return user.id === req.params.id; });
  let movie = Movies.find((movie) => { return movie.id === req.params.movie_id; });

  if (user && movie) {
    user.favorites = user.favorites.filter((movie_id) => { return movie_id !== req.params.movie_id; });
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with id ' + req.params.movie_id + ' was not found.');
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  }
});

//Get all users
app.get('/users', function(req, res) {

  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Get a user by username
app.get('/users/:Username', function(req, res) {
  Users.findOne({ Username : req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

app.listen(8080, () => {
  console.log(`Your app is listening on port 8080`);
});