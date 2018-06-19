import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import App from './containers/App';
import reducer from './reducers';
import PageLanding from './components/PageLanding';

const INITIAL_STATE = {
  user: {
    token: localStorage.getItem('token'),
  },
};
const enhancer = applyMiddleware(reduxThunk);
const store = createStore(reducer, INITIAL_STATE, enhancer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={PageLanding} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
