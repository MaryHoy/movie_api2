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

mongoose.connect('mongodb+srv://maryhoy:1981@@cluster0-uufoi.mongodb.net/myFlixDB?retryWrites=true', { useNewUrlParser: true });

const app = express();

var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

//CORS
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use(morgan('common'));
app.use(bodyParser.json());
//User Auth
var auth = require('./auth')(app);
app.use(express.static('public'));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Somethings not right");
});

//Requests
app.get('/', function(req, res) {
  var responseText = 'Welcome to myFlixDB'
  res.send(responseText);
});

// Return a list of ALL movies to the user
app.get("/movies", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
    })
    .catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then(function(movie){
    if(movie){
      res.json(movie);
    }else{
      res.status(400).send(req.params.Title + "does not exist");
    }
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get("/movies/genres/:Title", (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then(function(movie){
    if(movie){
      res.status(201).json(movie.Genre);
    }else{
      res.status(400).send(req.params.Title + "does not exist");
    }
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({"Director.Name" : req.params.Name})
  .then(function(movies){
    res.json(movies.Director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error:" + err);
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
app.post('/users',
  [check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()],(req, res) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username : req.body.Username }) // Search to see if a user with the requested username already exists
  .then(function(user) {
    if (user) {
        return res.status(400).send(req.body.Username + " already exists");
    } else {
      Users
      .create({
        Username : req.body.Username,
        Password: hashedPassword,
        Email : req.body.Email,
        Birthday : req.body.Birthday
      })
      .then(function(user) { res.status(201).json(user) })
      .catch(function(error) {
          console.error(error);
          res.status(500).send("Error: " + error);
      });
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
app.put("/users/:Username",
passport.authenticate('jwt', { session: false }),
[
  check('Username', 'Username should be longer than 4 characters.').isLength({
    min: 4
  }),
  check(
    'Username',
    'Username contains non alphanumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('Password', 'Password is required')
    .not()
    .isEmpty(),
  check('Email', 'Please enter a valid email address').isEmail()
],
(req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }
  )
    .then(user => res.status(201).json(user))
    .catch(error => errorHandler(error, res));
}
);

// Allow users to add a movie to their list of favorites
app.post("/users/:Username/Movies/:MovieID", function(req, res) {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    function(err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Allow users to remove a movie from their list of favorites
app.delete(
  "/users/:Username/FavoriteMovies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Get all users
app.get("/users", function(req, res) {
  Users.find()
    .then(function(users) {
      res.status(201).json(users);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username
app.get("/users/:Username", function(req, res) {
  Users.findOne({ Username: req.params.Username })
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000.")
});

