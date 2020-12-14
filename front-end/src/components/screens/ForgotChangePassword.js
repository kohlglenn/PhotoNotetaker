import React, { useState } from 'react';

import Navbar from '../layout/Navbar';
import PasswordTokenForm from '../widgets/PasswordTokenForm';

function ForgotChangePassword(props) {
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
        <PasswordTokenForm {...props} />
      </div>
    </Navbar>
  );
}

export default ForgotChangePassword;
