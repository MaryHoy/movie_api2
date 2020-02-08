const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

var movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

var userSchema = mongoose.Schema({
  username : {type: String, required: true},
  password : {type: String, required: true},
  email : {type: String, required: true},
  birthday : Date,
  FavoriteMovies : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password); 
};

var Movie = mongoose.model("Movie", movieSchema);
var user = mongoose.model("user", userSchema);

module.exports.Movie = Movie;
module.exports.user = user;