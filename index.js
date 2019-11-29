const express = require("express");
const app = express();
const morgan = require("morgan");
const Movie = require("./movies");
//const Text = require("./text");
let topMovies = [
  {
    title: "Avengers 1",
  },
  {
    title: "Avengers 2",
  },
  {
    title: "Avengers 3",
  }
];

app.use(express.static('public'));
app.use(morgan('common'));
app.get("/index.html", function(req, res) {});
app.get("/", function(req, res) {
  res.send("Welcome to my app!");

});
app.get("/secreturl", function(req, res) {
  res.send("This is a secret url with super top-secret content.");
});

app.get("/document", function(req, res) {
  res.sendFile("public/document.html", { root: __dirname });
});
app.get("/books", function(req, res) {
  res.json(topMovies);
});

app.get("/movies", function(req, res) {
  console.log(Movie);
  res.json(Movie);
});

app.get("/text", function(req, res) {
  res.send(Text);
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
