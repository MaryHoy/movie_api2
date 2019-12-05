const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(bodyParser.json());

let Users = [
  {id: '0', name: 'John Doe', username: 'John88', password: 'Johndoepw', email: 'johndoe@gmail.com', birthday: '1990-10-10', favorites: ['1']}
];

let Directors = [ 
  {name: 'Jonathan Demme', bio: 'Robert Jonathan Demme was an American director, producer, and screenwriter.', birthyear: '1944', deathyear: 'NULL'},
  {name: 'Judd Apatow', bio: 'Judd Apatow is an American producer, writer, director, actor and stand-up comedian.', birthyear: '1967', deathyear: 'NULL'},
  {name: 'Anthony Russo', bio: 'Anthony Russo is an American film and television director. Russo directs most of his work together with his brother Joseph Russo and occasionally they work as producers, screenwriters, actors, and editors.', birthyear: '1970', deathyear: 'NULL'},
];

let Genres = [ 
  { name: 'Comedy', description: 'Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.'},
  { name: 'Action', description: 'Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, and frantic chases.'},
  { name: 'Animated', description: 'Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.'},
];

let Movies = [ 
  {
    id: '0',
    title : 'Iron Man',
    year : '2008',
    description: ' Iron Man is a 2008 American superhero film based on the Marvel Comics character of the same name.',
    genre: 'Action',
    director: 'Jon Favreu',
    imageURL: 'ironmanimg.png',
    featured: 'false'
  },
  {
    id: '1',
    title : 'The Lion King',
    year : '1994',
    description: 'The Lion King is a 1994 American animated musical film produced by Walt Disney Feature Animation and released by Walt Disney Pictures.',
    genre: 'Animation',
    director: 'Robert Minkoff',
    imageURL: 'lionkingimg.png',
    featured: 'false'
  },
  {
    id: '2',
    title : 'Airplane!',
    year : '1980',
    description: 'Airplane! is a 1980 American satirical disaster film written and directed by David and Jerry Zucker and Jim Abrahams and produced by Jon Davison.',
    genre: 'Comedy',
    director: 'David Zucker',
    imageURL: 'airplaneimg.png',
    featured: 'false'
  },
];

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.json(Movies);
});

// Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  res.json(Movies.find( (movie) => { return movie.title.toLowerCase().includes(req.params.title.toLowerCase()); }));
});

// Return data about a genre (description) by name/title
app.get('/genres/:name', (req, res) => {
  res.json(Genres.find( (genre) => { return genre.name === req.params.name; }));
});

// Return data about a director by name
app.get('/directors/:name', (req, res) => {
  res.json(Directors.find( (director) => { return director.name === req.params.name; }));
});

// Get the list of data about all Movies
app.get('/users', (req, res) => {
  res.json(Users);
});

// Allow new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
  let user = Users.find((user) => { return user.id === req.params.id; });

  if (user) {
    Users = Users.filter(function(obj) { return obj.id !== req.params.id; });
    res.status(201).send('User ' + user.name + ' with id ' + req.params.id + ' was deleted.')
  }
});

// Allow users to update their user info
app.put('/users/:id', (req, res) => {
  let user = Users.find((user) => { return user.id === req.params.id; });
  let newUserInfo = req.body;

  if (user && newUserInfo) {
    newUserInfo.id = user.id;
    newUserInfo.favorites = user.favorites;    
    Object.assign(user, newUserInfo);
    Users = Users.map((user) => (user.id === newUserInfo.id) ? newUserInfo : user);
    res.status(201).send(user);
  } else if (!newUserInfo.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  } 
});

// Allow users to add a movie to their list of favorites
app.post('/users/:id/:movie_id', (req, res) => {
  let user = Users.find((user) => { return user.id === req.params.id; });
  let movie = Movies.find((movie) => { return movie.id === req.params.movie_id; });

  if (user && movie) {
    user.favorites = [...new Set([...user.favorites, req.params.movie_id])];
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with id ' + req.params.movie_id + ' was not found.');
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  }
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

aapp.listen(8080, () => {
  console.log(`Your app is listening on port 8080`);
});