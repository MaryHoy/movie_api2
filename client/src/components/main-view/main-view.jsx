import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route } from 'react-router-dom';

// #0
import { setMovies } from '../../actions/actions';

     // we haven't written this one yet
import MoviesList from '../movies-list/movies-list';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      movies: [],
      user: null,
      register: false,
      profileData: null
    };
  }

componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
}

 getMovies(token) {
    axios.get('https://maryhoyflixdb.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // #1
      this.props.setMovies(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
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

  updateUser(data) {
    this.setState({
      userInfo: data
    });
    localStorage.setItem('user', data.Username);
  }

  onLoggedOut() {
    this.setState({
      user: null
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  render() {

    // #2
    let { movies } = this.props;
    let { user } = this.state;
    let { profileData } = this.state;
    

    
    return (
      
      <Router>
         <div className="main-view">
         <Link to={`/users/${user}`}>
            <Button variant="primary" type="profile">Profile
             </Button>
          </Link>
          <Button variant="primary" type="logOut" onClick={() => this.onLoggedOut()}>Logout
          </Button>
          <Link to={`/register`}>
            <Button variant="primary" type="profile">Register
             </Button>
             </Link>
           <Route exact path="/" render={() => {
             if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
             return <MoviesList movies={movies}/>;
         }} />
           <Route path="/register" render={() => <RegistrationView />} />
           <Route path="/users/:Username" render={() => { 
            return <ProfileView profileData={profileData} /> }} />
           <Route path="/movies/:movieId" render={({match}) => <MovieView movie={movies.find(m => m._id === match.params.movieId)}/>}/>
           <Route path="/genres/:name" render={({ match }) => {
            if (!movies || !movies.length) return <div className="main-view" />;
            return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
          }
          } />
         <Route exact path="/directors/:name" render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return ( <DirectorView director={ movies.find( m => m.Director.Name === match.params.name ).Director} />
              );
            }}
          />
        </div>
      </Router>
    );
  }
}


// #3
const mapStateToProps = state => {
  return { movies: state.movies }
}

// #4
export default connect(mapStateToProps, { setMovies } )(MainView);