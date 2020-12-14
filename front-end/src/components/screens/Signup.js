import React, { useState } from 'react';
import RegistrationForm from '../widgets/RegisterForm';
import Navbar from '../layout/Navbar';
import UserAgreement from '../widgets/UserAgreement';

function Signup(props) {
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
        <RegistrationForm modalVisible={setIsModalVisible} />
        {isModalVisible ? (
          <UserAgreement modalVisible={setIsModalVisible} />
        ) : null}
      </div>
    </Navbar>
  );
}

export default Signup;
