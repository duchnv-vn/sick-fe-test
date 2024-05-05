'use client';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, theme } from 'antd';
import AccountMenu from '../AccountMenu';

const { Header } = Layout;

const LayoutHeader: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header style={{ background: colorBgContainer }} className="layout-header">
      <div className="left-section"></div>
      <div className="right-section">
        <AccountMenu />
      </div>
    </Header>
  );
};

export default observer(LayoutHeader);
