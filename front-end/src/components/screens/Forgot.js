import React, { useState } from 'react';

import Navbar from '../layout/Navbar';
import EmailForm from '../widgets/EmailForm';

function Forgot(props) {
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
        <EmailForm />
      </div>
    </Navbar>
  );
}

export default Forgot;
