import React, { useState } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://maryhoyflixdb.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('no such user')
      });
  };
  

  return (
    <Container className='loginContainer'>
      <h1>Welcome to myFlix!</h1>
      <form>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Email Username</Form.Label>
          <Form.Control type="email" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button id='loginButton' onClick={handleSubmit}>
          Log in
        </Button>

        <Form.Group controlId='newUser'>
          <Form.Text>New User? <Button id='registerButton' onClick={() => props.onClick()}> Register! </Button>
          </Form.Text>
        </Form.Group>
    </form>
    </Container>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};