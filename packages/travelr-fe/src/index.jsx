// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';

import App from './containers/App';
import reducer from './reducers';

const epicMiddleware = createEpicMiddleware();

const enhancer = applyMiddleware(reduxThunk, epicMiddleware);

// don't write initial state here. write it in each reducer.
// $FlowIgnore
const store = createStore(reducer, {}, enhancer);

epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  // $FlowIgnore
  document.getElementById('root'),
);
