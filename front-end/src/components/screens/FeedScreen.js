import React from 'react';

import Navbar from '../layout/Navbar';
import Feed from '../widgets/Feed';

function FeedScreen(props) {
  return (
    <Navbar {...props}>
      <Feed {...props} />
    </Navbar>
  );
}

export default FeedScreen;
