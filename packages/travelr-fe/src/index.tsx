import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reduxThunk from 'redux-thunk';
import App from './containers/App';
import reducer from './reducers/index';

const epicMiddleware = createEpicMiddleware();

const enhancer = applyMiddleware(reduxThunk);

// don't write initial state here. write it in each reducer.
const store = createStore(reducer, {}, enhancer);

// epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    {
      // @ts-ignore
      <App />
    }
  </Provider>,
  document.getElementById('root'),
);
