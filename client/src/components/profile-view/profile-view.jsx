import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./profile-view.scss";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";


const mapStateToProps = state => {
  const token = localStorage.getItem('token')
  const { profile, movies, favorites } = state;
  const userProfile = localStorage.getItem('user');
  const user = profile.find(u => u.username === userProfile);
  const isFavorite = movies.filter(movie =>
    favorites.find(id => id === movie._id)
  )
  ;


  return { profile, movies, token, user, favorites, isFavorite };
}

export class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      birthday: "",
      password: "",
      confirmPassword: "",
      favorites: []
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onBirthdayChange = this.onBirthdayChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  onUsernameChange(event) {
    this.setState({
      username: event.target.value
    });
  }
  onEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }
  onBirthdayChange(event) {
    this.setState({
      birthday: event.target.value
    });
  }
  onPasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }
  onConfirmPasswordChange(event) {
    this.setState({
      confirmPassword: event.target.value
    });
  }

  handleUpdate(token) {
    const { user } = this.props;
    const { username, email, birthday, password, confirmPassword } = this.state;
    axios({
      method: "put",
      url: `https://maryhoyflixdb.herokuapp.com/users/${user.username}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        username: username,
        email: email,
        birthday: birthday,
        password: password,
        confirmPassword: confirmPassword
      }
    })
      .then(response => {
        //const data = response.data;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
      })
      .catch(e => {
        console.log("error updating the user");
      });
  }

  handleDelete(token) {
    const { user } = this.props;
    axios
      .delete(`https://maryhoyflixdb.herokuapp.com/users/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeFavorite(id, token) {
    const { user } = this.props;
    axios.delete(
      `https://maryhoyflixdb.herokuapp.com/users/${user.username}/favorites/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  }



  render() {


    const { user, token, favorites, isFavorite } = this.props;
    console.log(favorites)
    if (!this.props.profile || !this.props.user || !this.props.favorites || !this.props.movies ) return "loading profile...";

    const displayFavorites = isFavorite.map(movie => (
      <Card key={movie._id}  style={{ width: "35rem" }}>
        <Card.Text>{movie.title}</Card.Text>
        <Button variant="secondary" className="submit"  onClick={() => this.removeFavorite(movie._id, token)}>
          Remove from favorites?
        </Button>
      </Card>
    ));


    return (
      <div>
        <h1>Favorite Movies</h1>
        <div className="d-flex justify-content-center">{displayFavorites}</div>
        <Form>
          <h1> Update Profile </h1>
          <h4> You will need to log in again once changes are submitted!</h4>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              value={this.state.username}
              onChange={this.onUsernameChange}
              placeholder="Enter username to update"
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={this.state.email}
              onChange={this.onEmailChange}
              placeholder="Enter New Email"
            />
          </Form.Group>
          <Form.Group controlId="formBasicBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={this.state.birthday}
              onChange={this.onBirthdayChange}
              placeholder="yyyy-mm-dd"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
              placeholder="Enter New Password"
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={this.state.confirmPassword}
              onChange={this.onConfirmPasswordChange}
              placeholder="Re-enter Password"
            />
          </Form.Group>
          <Button
            className="submit"
            onClick={() => this.handleUpdate(token)}
            disabled={!this.state.username || !this.state.password || this.state.password !== this.state.confirmPassword}
          >
            <Link to={'/'}> Update Profile </Link>
          </Button>
        </Form>
        <Button className="submit" onClick={() => this.handleDelete(token)}>
          <Link to={`/`}> Delete Profile {user.username}?</Link>
        </Button>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ProfileView);