// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './containers/App';
import reducer from './reducers';

const enhancer = applyMiddleware(reduxThunk);

// don't write initial state here. write it in each reducer.
const store = createStore(reducer, {}, enhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  // $FlowIgnore
  document.getElementById('root'),
);
