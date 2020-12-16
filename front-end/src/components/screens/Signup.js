import React, { useState } from 'react';
import RegistrationForm from '../widgets/RegisterForm';
import LayoutNoNavbar from '../layout/LayoutNoNavbar';
import UserAgreement from '../widgets/UserAgreement';

function Signup(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <RegistrationForm modalVisible={setIsModalVisible} {...props} />
        {isModalVisible ? (
          <UserAgreement modalVisible={setIsModalVisible} />
        ) : null}
      </div>
    </LayoutNoNavbar>
  );
}

export default Signup;
