import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './profile-view.scss'

import { Link } from "react-router-dom";

export class ProfileView extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      profileData: null,
      favoriteMovies: []
    };
  }

  componentDidMount() {
    //authentication
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://maryhoyflixdb.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userData: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favouriteMovies: response.data.Favourites
        });
      })
      .catch(function (error) {
        console.log(error);
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

  deleteMovieFromFavs(event, favoriteMovies) {
    event.preventDefault();
    console.log(favoriteMovies);
    axios.delete(`https://myaryhoyflixdb2.herokuapp.com/users/${localStorage.getItem('user')}/Favorites/${favoriteMovies}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert('Oops... something went wrong...');
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { username, email, birthday, favoriteMovies } = this.state;

    return (
      <Card className="profile-view" style={{ width: '32rem' }}>
      <Card.Body>
        <Card.Title className="profile-title">My Profile</Card.Title>
        <ListGroup className="list-group-flush" variant="flush">
          <ListGroup.Item>Username: {username}</ListGroup.Item>
          <ListGroup.Item>Password:******* </ListGroup.Item>
          <ListGroup.Item>Email: {email}</ListGroup.Item>
          <ListGroup.Item>Birthday: {birthday && birthday.slice(0, 10)}</ListGroup.Item>
          <ListGroup.Item>Favorite Movies: {favoriteMovies}</ListGroup.Item>
        </ListGroup>
            <div className="text-center">
            <Link to={'/user/update'}>
                          <Button variant='primary'>Update Profile</Button>
                      </Link>
                      <Link to={'/user'}>
                          <Button variant='primary' onClick={() => this.deleteFavoriteMovie(favoriteMovies[0])}>Delete Favorite</Button>
                      </Link>
            <Link to={`/`}>
              <Button variant="primary" className="button-back">Back to movies</Button>
            </Link>
            <Link to={`/`}>
              <Button variant="danger" className="delete-button" onClick={() => this.deleteProfile()}>Delete my profile</Button>
              </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }
}