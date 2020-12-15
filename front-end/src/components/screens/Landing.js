import React, { useState } from 'react';

import LayoutNoNavbar from '../layout/LayoutNoNavbar';
import LoginForm from '../widgets/LoginForm';

function Landing(props) {
  return (
    <LayoutNoNavbar {...props}>
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
    </LayoutNoNavbar>
  );
}

export default Landing;
