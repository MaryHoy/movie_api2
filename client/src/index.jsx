import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import MainView from './components/main-view/main-view';

import './index.scss';

const store = createStore(moviesApp);

class MyFlixApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    ); 
  }
}

// Finds the root of your app
const container = document.getElementsByClassName('app-container')[0];

// Tells React to render your app in the root DOM element
ReactDOM.render(React.createElement(MyFlixApp), container);