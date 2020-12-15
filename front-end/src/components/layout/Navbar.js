import React from 'react';
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
  const { children, history } = props;

  const onLogoutClick = () => {
    props.logoutUser();
    history.push('/');
  };

  const handleMenuClick = ({ item, key, keyPath, domEvent }) => {
    switch (key) {
      case '1':
        break;
      case '2':
        break;
      case '3':
        break;
      case '4':
        onLogoutClick();
        break;
      default:
      // do nothing
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'visible',
          height: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
          zIndex: 10
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/feed">Feed</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px 0', height: '100%' }}>
          <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: 360, backgroundColor: 'white' }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Kohl Peterson ©2020</Footer>
      </Layout>
    </Layout>
  );
};

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  logoutUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
