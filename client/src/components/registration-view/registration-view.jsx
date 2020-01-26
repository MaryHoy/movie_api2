import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './registration-view.scss';

export function RegistrationView(props) {
  const [username, createUsername] = useState('');
  const [password, createPassword] = useState('');
  const [email, createEmail] = useState('');
  const [birthday, createDob] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, birthday, email);
    // send a request to the server for authentication
    // workaround for authentication
    props.onLoggedIn(username);
  };

  return (
      <Form className="registration-form">
        <img src={logo} alt="logo" style={{ width: "300px" }} />
        <Form.Group controlId="formBasicUsername">
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => createUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Control
            type="text"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => createPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => createEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicBirthday">
          <Form.Control
            type="text"
            placeholder="Enter Date of Birth"
            value={birthday}
            onChange={(e) => createBirthday(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    );
  }
