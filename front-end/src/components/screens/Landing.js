import React, { useState } from 'react';

import Navbar from '../layout/Navbar';
import LoginForm from '../widgets/LoginForm';

function Landing(props) {
  return (
    <Navbar {...props}>
      <div
        id="container"
        style={{
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <LoginForm {...props} />
      </div>
    </Navbar>
  );
}

export default Landing;
