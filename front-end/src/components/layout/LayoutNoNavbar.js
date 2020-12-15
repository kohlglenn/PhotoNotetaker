import React from 'react';
import { Layout, Menu, Button } from 'antd';
import PropTypes from 'prop-types';

import Header from './Header';

const { Content, Footer } = Layout;

const LayoutNoNavbar = (props) => {
  const { children } = props;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content
        style={{
          margin: '24px 16px 0',
          height: '100%'
        }}
      >
        <div
          className="site-layout-background"
          style={{ padding: 0, minHeight: 360, backgroundColor: 'white' }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Kohl Peterson ©2020</Footer>
    </Layout>
  );
};

LayoutNoNavbar.propTypes = {
  children: PropTypes.node.isRequired
};

export default LayoutNoNavbar;
