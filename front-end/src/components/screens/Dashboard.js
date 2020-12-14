import React, { useState } from 'react';

import Navbar from '../layout/Navbar';
import Feed from '../widgets/Feed';

function Dashboard(props) {
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
        <Feed />
      </div>
    </Navbar>
  );
}

export default Dashboard;
