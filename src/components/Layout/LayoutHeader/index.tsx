'use client';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, theme } from 'antd';
import AccountMenu from '../AccountMenu';
import Button from '@/components/Elements/Button';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useStores } from '@/store/storeProvider';

const { Header } = Layout;

const LayoutHeader: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const {
    CommonStore: { isDisplaySidebar, setIsOpenPhoneDrawer, isOpenPhoneDrawer },
  } = useStores();

  return (
    <Header style={{ background: colorBgContainer }} className="layout-header">
      <div className="left-section">
        {!isDisplaySidebar && (
          <Button
            {...{
              icon: faBars,
              className: 'header-sidebar-button',
              onClick: () => setIsOpenPhoneDrawer(!isOpenPhoneDrawer),
            }}
          />
        )}
      </div>
      <div className="right-section">
        <AccountMenu />
      </div>
    </Header>
  );
};

export default observer(LayoutHeader);
