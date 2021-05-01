import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Button } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';

import { logoutUser } from '../../actions/authActions';
import Header from './Header';

const { Content, Footer, Sider } = Layout;

const Navbar = (props) => {
  const { children, history, auth } = props;

  const onLogoutClick = () => {
    props.logoutUser();
  };

  useEffect(() => {
    console.log(auth);
    if (!auth.isAuthenticated) {
      history.push('/');
    }
  }, [auth]);

  const handleMenuClick = ({ item, key, keyPath, domEvent }) => {
    switch (key) {
      case '1':
        history.push(`/feed/${auth.user.username}`);
        break;
      case '2':
        history.push(`/create`);
        break;
      case '3':
        onLogoutClick();
        break;
      default:
      // do nothing
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ margin: '24px 16px 0', height: '100%' }}>
        <div
          className="site-layout-background"
          style={{ padding: 0, minHeight: 360, backgroundColor: 'white' }}
        >
          {children}
        </div>
        <div style={{ height: '8vh', minHeight: 50 }} />
      </Content>

      <Footer
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100vw',
          bottom: 0,
          left: 0,
          height: '8vh',
          minHeight: 50,
          backgroundColor: '#fff',
          padding: 0
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ width: '100%', height: '100%', textAlign: 'center' }}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1">Feed</Menu.Item>
          <Menu.Item key="2">Add Tree</Menu.Item>
          <Menu.Item key="3">Logout</Menu.Item>
        </Menu>
      </Footer>
    </Layout>
  );
};

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  logoutUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
