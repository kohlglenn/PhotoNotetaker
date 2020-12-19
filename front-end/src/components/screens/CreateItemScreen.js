import React, { useState } from 'react';
import CreatItemForm from '../widgets/CreateItemForm';
import Navbar from '../layout/Navbar';

function CreateItemScreen(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <CreatItemForm />
      </div>
    </Navbar>
  );
}

export default CreateItemScreen;
