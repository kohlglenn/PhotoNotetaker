import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// This actually is a redirect page.... I want to refactor this out in the future. Scope change

function Dashboard(props) {
  const { auth } = props;
  const { isAuthenticated, user } = auth;

  return isAuthenticated ? (
    <Redirect to={`/feed/${user.username}`} />
  ) : (
    <Redirect to="/" />
  );
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard);
