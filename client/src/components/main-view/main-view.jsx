import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';

import { MovieCard } from '../movie-card/movie-card';
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

  //one of the hooks available in React Component

  componentDidMount() {
    axios.get('https://maryhoyflixdb.herokuapp.com/movies')
    .then(res => {
      console.log(res);
      ///assign the result to a state
      this.setState({
        movies: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
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
      register: false,
    });
  }
  register() {
    this.setState({
      register: true
    });
  }

render() {
  const { movies, selectedMovie, user, register } = this.state;

  if (!user && register === false) return <LoginView onClick={() => this.register()} onLoggedIn={user => this.onLoggedIn(user)} />

  if (register) return <RegistrationView onClick={() => this.alreadyMember()} onSignedIn={user => this.onSignedIn(user)} />

//before the movies has been loaded
  if (!movies) return <div className="main-view" />;
  return (
    <div className="main-view">
     {selectedMovie
        ? <MovieView movie={selectedMovie}/>
        : movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
        ))
     }
    </div>
   );
 }
}