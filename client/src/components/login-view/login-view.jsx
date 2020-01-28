import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const registration = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    // send a request to the server for authentication
    // workaround for authentication
    props.onLoggedIn(username);
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