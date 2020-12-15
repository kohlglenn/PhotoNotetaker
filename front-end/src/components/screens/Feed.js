import React from 'react';

import Navbar from '../layout/Navbar';
import Feed from '../widgets/Feed';

function Dashboard(props) {
  return (
    <Navbar {...props}>
      <Feed />
    </Navbar>
  );
}

export default Dashboard;
