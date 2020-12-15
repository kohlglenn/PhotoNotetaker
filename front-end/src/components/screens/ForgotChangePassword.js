import React, { useState } from 'react';

import LayoutNoNavbar from '../layout/LayoutNoNavbar';
import PasswordTokenForm from '../widgets/PasswordTokenForm';

function ForgotChangePassword(props) {
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
        <PasswordTokenForm {...props} />
      </div>
    </LayoutNoNavbar>
  );
}

export default ForgotChangePassword;
