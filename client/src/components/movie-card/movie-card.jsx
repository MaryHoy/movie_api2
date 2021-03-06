import React from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './movie-card.scss';

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <div className="col-10 col-lg-3 ml-5 mt-5">
      <Card style={{ width: '16rem' }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="link">More</Button>
          </Link>
        </Card.Body>
      </Card>
     </div>
     );
   }
 }

