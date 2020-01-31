import axios from 'axios';
import React from 'react';

import { BrowserRouter as Router, Route} from "react-router-dom";

import { MovieCard } from '../movie-card/movie-card';
import Button from 'react-bootstrap/Button';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';

import './main-view.scss';

export class MainView extends React.Component {
         constructor(props) {
           super(props);
           this.state = {
             movies: [],
             selectedMovie: null,
             user: null,
             register: false
           };
         }

         getMovies(token) {
           axios
             .get("https://maryhoyflixdb.herokuapp.com/movies", {
               headers: { Authorization: `Bearer ${token}` }
             })
             .then(response => {
               // Assign the result to the state
               this.setState({
                 movies: response.data
               });
             })
             .catch(function(error) {
               console.log(error);
             });
         }

         componentDidMount() {
           let accessToken = localStorage.getItem("token");
           if (accessToken !== null) {
             this.setState({
               user: localStorage.getItem("user")
             });
             this.getMovies(accessToken);
           }
         }

         //one of the hooks available in React Component

         onLoggedIn(authData) {
           console.log(authData);
           this.setState({
             user: authData.user.Username
           });

           localStorage.setItem("token", authData.token);
           localStorage.setItem("user", authData.user.Username);
           this.getMovies(authData.token);
         }

         onLoggedOut() {
           this.setState({
             user: null
           });

           localStorage.removeItem("token");
           localStorage.removeItem("user");
         }

         onMovieClick(movie) {
           this.setState({
             selectedMovie: movie
           });
         }

         onButtonClick() {
           this.setState({
             selectedMovie: null
           });
         }

         onSignedIn(user) {
           this.setState({
             user: user,
             register: false
           });
         }
         register() {
           this.setState({
             register: true
           });
         }

         render() {
           const { movies, selectedMovie, user, register } = this.state;

           if (!user && register === false)
             return (
               <LoginView
                 onClick={() => this.register()}
                 onLoggedIn={user => this.onLoggedIn(user)}
               />
             );

           if (register)
             return (
               <RegistrationView
                 onClick={() => this.alreadyMember()}
                 onSignedIn={user => this.onSignedIn(user)}
               />
             );

           if (!movies) return <div className="main-view" />;

           return (
             <Router>
               <div className="main-view">
                 <Button
                   variant="primary"
                   type="submit"
                   onClick={() => this.onLoggedOut()}
                 >
                   Logout
                 </Button>
                 <Route
                   exact
                   path="/"
                   render={() => {
                     if (!user)
                       return (
                         <LoginView
                           onLoggedIn={user => this.onLoggedIn(user)}
                         />
                       );
                     return movies.map(m => (
                       <MovieCard key={m._id} movie={m} />
                     ));
                   }}
                 />
                 <Route
                   exact
                   path="/movies/:movieId"
                   render={({ match }) => (
                     <MovieView
                       movie={movies.find(m => m._id === match.params.movieId)}
                     />
                   )}
                 />
                 <Route path="/genres/:name" render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
            }
            } />
                 <Route
                   exact
                   path="/directors/:name"
                   render={({ match }) => {
                     if (!movies) return <div className="main-view" />;
                     return (
                       <DirectorView
                         director={
                           movies.find(
                             m => m.Director.Name === match.params.name
                           ).Director
                         }
                       />
                     );
                   }}
                 />
               </div>
             </Router>
           );
         }
       }
