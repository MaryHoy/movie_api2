import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';


import './profile-view.scss';
import axios from 'axios';

export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  deleteFavorite(movieId) {
    axios.delete(`https://maryhoyflixdb.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movieId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        document.location.reload(true);
      })
      .then(res => {
        alert('Movie deleted from favorites');
      })

      .catch(e => {
        alert('Movie could not be deleted from favorites ' + e)
      });
  }

  deleteProfile() {
    axios.delete(`https://maryhoyflixdb.herokuapp.com/users/${localStorage.getItem('user')}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        alert('Do you really want to delete your account?')
      })
      .then(res => {
        alert('Account was successfully deleted')
      })
      .then(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.setState({
          user: null

        });
        window.open('/', '_self');
      })
      .catch(e => {
        alert('Account could not be deleted ' + e)
      });
  }



  render() {
    const { user, userProfile, movies } = this.props;

    const favoritesList = movies.filter(movie => userProfile.Favorites.includes(movie._id));

    if (!user || !userProfile || !movies || movies.length === 0) return <div>loading</div>;

    return (
      <div className="profile-view">
        <Container>
          <Card style={{ minwidth: '20rem' }} className="border-0 pl-0">
            <Card.Body>
              <span className="d-flex align-items-center mb-4">
                <h1 className="display-4">User Profile</h1>
              </span>
              <Card.Text className="mb-4 lead">
                <span className="font-weight-bold">Username: </span>{userProfile.Username} <br />
                <span className="font-weight-bold">Email: </span>{userProfile.Email} <br />
                <span className="font-weight-bold">Birthday: </span>{userProfile.Birthday.slice(0, 10)} <br />
              </Card.Text>
              <Link to={`/update/${userProfile.Username}`}>
                <Button variant="primary" className="update-button">Update my profile</Button>
              </Link>

              <Button variant="primary" className="delete-button ml-2" onClick={() => this.deleteProfile()}>Delete my profile</Button>
            </Card.Body>
          </Card>
          <Container>

            <h4 className="mt-4 mb-4">My favorite movies: </h4>
            {userProfile.Favorites.length === 0 &&
              <div>You don't have any favorites yet!</div>}
            {userProfile.Favorites.length > 0 &&
              <ul className="ml-0 pl-0">
                {favoritesList.map(movie =>
                  (
                    <li key={movie._id} className="mb-2 ">
                      <span className="d-flex align-items-center">
                        <Button variant="primary" size="sm" className="delete-movie mr-2" onClick={e => this.deleteFavorite(movie._id)}>
                          <i className="material-icons bin">delete</i>
                        </Button>
                        <Link to={`/movies/${movie._id}`}>
                          <h5 className="movie-link link">{movie.Title}</h5>
                        </Link>

                      </span>
                    </li>
                  ))}
              </ul>

            }

          </Container>
        </Container>
      </div >


    );

  }
}