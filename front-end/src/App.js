import './App.css';
import 'antd/dist/antd.css';
import './index.css';

import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';
import PrivateRoute from './components/private-route/PrivateRoute';
import Landing from './components/screens/Landing';
import Signup from './components/screens/Signup';
import Forgot from './components/screens/Forgot';
import Dashboard from './components/screens/Dashboard';

// TODO: Implement Forgot Password Screen, Logout Button on Nav, Nav popout not visible on some screens, update profile screen, profile screen, user feed

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwtDecode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = './login';
  }
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const App = (props) => {
  const { location } = props;
  return (
    <Provider store={store}>
      <Router>
        <Route location={location} exact path="/" component={Landing} />
        <Route location={location} path="/signup" component={Signup} />
        <Route location={location} path="/forgot" component={Forgot} />
        <Switch>
          <PrivateRoute
            location={location}
            path="/dashboard"
            component={Dashboard}
          />
        </Switch>
      </Router>
    </Provider>
  );
};
App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default App;
