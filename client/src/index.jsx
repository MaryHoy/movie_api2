// client/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { MainView } from './components/main-view/main-view';

// Import statement to indicate that we need to bundle `./index.scss`
import './index.scss';


class MyFlixApplication extends React.Component {

  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios.get('https://maryhoyflixdb.herokuapp.com/movies')
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies } = this.state;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view"/>;

    return (
     <div className="main-view">
     { movies.map(movie => (
       <div className="movie-card" key={movie._id}>{movie.Title}</div>
     ))}
     </div>
    );
  }
}

// Find the root of our app
const container = document.getElementsByClassName('app-container')[0];

// Tell React to render our app in the root DOM element
ReactDOM.render(React.createElement(MyFlixApplication), container);