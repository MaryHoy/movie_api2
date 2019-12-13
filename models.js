const mongoose = require('mongoose');
var movieSchema = mongoose.Schema({
    Title : {type: String, required: true},
    Description : {type: String, required: true},
    Genre : {
        Name : String
    },
    Director : {
        Name : String,
        Bio : String
    },
    Actors : [String],
    ImagePath : String,
    Featured : Boolean
});

var usersSchema = mongoose.Schema({
    Username : {type: String, required: true},
    Password : {type: String, required: true},
    Email : {type: String, required: true},
    Birthday : Date,
    FavoriteMovies : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Moive' }]
});

var Movie = mongoose.model('movie', movieSchema);
var User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;