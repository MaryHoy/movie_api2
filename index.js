const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  Genres = Models.Genre,
  Directors = Models.Director,
  passport = require('passport'),
  cors = require('cors'),
  { check, validationResult } = require('express-validator');

require('./passport');

//Local database connection
// mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

//MongoDB Atlas connection
mongoose.connect('mongodb+srv://maryhoy:1981@@cluster0-uufoi.mongodb.net/myFlixDB?retryWrites=true', { useNewUrlParser: true });

const app = express();

var allowedOrigins = ['http://localhost:8080', 'http://erinnienhuis.com'];

//CORS implementation
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
})); //Does this belong in the Middleware requests area, or is it not considered Middleware?

//Middleware Requests
//Logging
app.use(morgan('common'));
//JSON Parsing
app.use(bodyParser.json());
//User Auth
var auth = require('./auth')(app);
//Static files
app.use(express.static('public'));
//App Routing -- always last
//Error Handling -- actually last of all middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Uh-oh! Something\'s not right!');
});

//Requests
app.get('/', function(req, res) {
  var responseText = 'Welcome to myFlixDB'
  res.send(responseText);
});

//Gets a list of movies - Mongoose .find()
app.get('/movies', function(req, res) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//Gets the data about a single movie by title
app.get("/movies/:Title", function(req, res) {
  Movies.findOne({ Title : req.params.Title })
  .then(function(movie) {
    res.json(movie)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err)
  });
  });

//Gets description of a genre by genre name
app.get("/genres/:Genre", function(req, res) {
  Genres.findOne({ Name : req.params.Genre })
  .then(function(genre) {
    res.json(genre.Description)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err)
  });
});

//Gets a list of movies by genre
app.get("/movies/genres/:genre", (req, res) => {
  //Search by genre name and return ID

  //Search all movie documents' Genres array for the ID returned above

  //Mongoose callback function
  //Movies.find( { "Genre.Name" : "Thriller" }, function(err, movies) {
    //Logic here
  //} );

  //Mongoose promise function
  //Movies.find( { "Genre.Name" : "Thriller" }).then(function(movies) {
    //Logic here
  //});

  res.send('This function is not yet built.');
})

//Gets data about a director by name
app.get("/directors/:Name", function(req, res) {
  Directors.findOne({ Name : req.params.Name })
  .then(function(director) {
    res.json(director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err)
  });
});

//Adds data for a new movie to the list of movies
app.post("/movies", (req, res) => {
//   let newMovie = req.body;
//   if (!newMovie.title) {
//     const message = "Missing title in request body";
//     res.status(400).send(message);
//   } else {
//     newMovie.id = uuid.v4();
//     topMovies.push(newMovie);
//     res.status(201).send(newMovie);
// }'
  res.send('This function is not yet built.');
});

//Deletes a movie from the list by title
app.delete("/movies/:title", (req, res) => {
  // let movie = topMovies.find((movie) => { return movie.title === req.params.title });
  //
  // if (movie) {
  //   topMovies.filter(function(obj) { return obj.title !== req.params.title });

  // res.status(201).send("Movie " + req.params.title + " was deleted.")
// }
  res.send('This function is not yet built.');
});

//USERS
//Gets all users - Mongoose .find()
app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Gets a user by username - Mongoose  .findOne()
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ Username : req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err)
  });
});

//Posts a new user - Mongoose .create()
app.post('/users',
  //Validation logic
  [
    check('Username', 'Username cannot have fewer than 5 characters.').isLength({min: 5}),
    check('Username', 'Username may not contain non alphanumeric characters.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email must be valid email address.').isEmail()
  ], (req, res) => {
    //Check validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  //API Post logic
  var hashedPassword = Users.hashPassword(req.body.Password); //Hash the password using the HashPassword from bcrypt, enforced by models.js

  Users.findOne({ Username : req.body.Username }) //Query db to see if user already exists
  .then(function(user) {
    if (user) { //if username already exists
      return res.status(400).send(req.body.Username + "already exists!");
    } else { //Username does not exist; create
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword, //Store the hashed password
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) }) //new document 'user' sent back to client with status code
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

//Updates user info by username - Mongoose Update - different syntax from the others
//If you don't include all the information from the collection in the update statement, it sets those values to null? Will need to change that
//Also need to check that the updated Username is not duplicated (and probably Email)
//Need to add an error response for when the query does not find a username to update
app.put("/users/:Username",
//Validation logic
[
  check('Username', 'Username cannot have fewer than 5 characters.').isLength({min: 5}),
  check('Username', 'Username may not contain non alphanumeric characters.').isAlphanumeric(),
  check('Password', 'Password is required.').not().isEmpty(),
  check('Email', 'Email must be valid email address.').isEmail()
], passport.authenticate('jwt', { session: false }), function(req, res) {

  //Check validation object for errors
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //API Post logic
  var hashedPassword = Users.hashPassword(req.body.Password); //Hash the password using the HashPassword from bcrypt, enforced by models.js

  Users.findOneAndUpdate({ Username : req.params.Username }, { $set :
    {
      Username : req.body.Username,
      Password : hashedPassword,
      Email : req.body.Email,
      Birthday : req.body.Birthday
    }},
    { new : true }, //Makes sure updated document is returned
    function(err, updatedUser) {
      if(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

//Adds a movie to a list of user favorites - Mongoose - same syntax as Update User Info
//Needs the MovieID - need logic to derive the ID from the movie Title
//Validation to prevent favorites being added to other user's lists?
app.post("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $push : { FavoriteMovies : req.params.MovieID }
  },
  { new : true },
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

//Removes a movie from a list of favorites - Mongoose Delete
//Validation to prevent favorites being removed from other user's lists?
app.delete("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $pull : { FavoriteMovies : req.params.MovieID }
  },
  { new : true },
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

//Removes a user
//Validation to a user from deleting a user other than themself? Does the passport.authenticate do this already? I think it might.
app.delete("/users/:Username", passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndRemove({ Username : req.params.Username })
  .then(function(user) {
    if(!user) {
      res.status(400).send(req.params.Username + " was not found!");
    } else {
      res.status(200).send(req.params.Username + " was deleted!");
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Listen for requests
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000.")
});