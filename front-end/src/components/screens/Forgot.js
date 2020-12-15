import React, { useState } from 'react';

import LayoutNoNavbar from '../layout/LayoutNoNavbar';
import EmailForm from '../widgets/EmailForm';

function Forgot(props) {
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
        <EmailForm />
      </div>
    </LayoutNoNavbar>
  );
}

export default Forgot;
