import React from 'react';
//propTypes validate the data types based on the configuration
import PropTypes from 'prop-types';
//bootstrap info
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    const { movie, onClick } = this.props;

    return (
      <div className="col-10 col-lg-3 ml-5 mt-5">
      <Card style={{ width: '16rem' }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
           <Button variant="primary" onClick={() => onClick(movie)} className="movie-card">
              View
           </Button>
        </Card.Body>
      </Card>
     </div>
     );
   }
 }

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

