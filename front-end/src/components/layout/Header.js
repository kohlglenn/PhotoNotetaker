import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const CustomHeader = (props) => {
  return (
    <Header
      className="site-layout-sub-header-background"
      style={{
        position: 'sticky',
        zIndex: 1,
        width: '100%',
        top: 0,
        left: 0,
        height: '8vh',
        minHeight: 50
      }}
    />
  );
};

export default CustomHeader;
