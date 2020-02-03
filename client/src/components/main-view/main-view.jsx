import axios from 'axios';
import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from 'react-router-dom';

import { MovieCard } from '../movie-card/movie-card';
import Button from 'react-bootstrap/Button';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { DirectorView } from '../director-view/director-view';
import { RegistrationView } from '../registration-view/registration-view';

import './main-view.scss';

export class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      register: false,
      profileData: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
        profileData: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getProfileData(token) {
    axios.get(`https://maryhoyflixdb.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setUserProfile(response.data);
      })
      .catch(function (error) {
        alert('An error occured: ' + error);
      });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
      profileData: authData.user
    });
    this.props.setLoggedInUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }


  getMovies(token) {
    axios
      .get("https://maryhoyflixdb.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
        <RegistrationView onClick={() => this.alreadyMember()} onSignedIn={user => this.onSignedIn(user)}
        />
      );

    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Link to={`/users/${user}`}>
            <Button className="primary" variant="submit">Profile
             </Button>
          </Link>
          <Button variant="primary" type="submit" onClick={() => this.onLoggedOut()}>Logout
          </Button>
          <Route exact path="/" render={() => {
              if (!user) return ( <LoginView onLoggedIn={user => this.onLoggedIn(user)}
                  />
                );
              return movies.map(m => ( <MovieCard key={m._id} movie={m} />
              ));
            }}
          />
          <Route exact path="/movies/:movieId" render={({ match }) => (
              <MovieView movie={movies.find(m => m._id === match.params.movieId)}
              />
            )}
          />
          <Route path="/users/:Username" render={({ match }) => { return <ProfileView profileData={profileData} /> }} />
          <Route path="/update/:Username" render={() => <ProfileUpdate profileData={profileData} user={user} token={token} updateUser={data => this.updateUser(data)} />}
          />
          <Route exact path="/update/:Username" render={() => <UpdateView user={user} />} />
          <Route path="/genres/:name" render={({ match }) => {
            if (!movies || !movies.length) return <div className="main-view" />;
            return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
          }
          } />
          <Route exact path="/directors/:name" render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return ( <DirectorView director={ movies.find( m => m.Director.Name === match.params.name ).Director
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


