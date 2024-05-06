'use client';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Menu } from 'antd';
import Image from '@/components/Elements/Image';
import whiteLogo from '../../../assets/image/white_logo.svg';
import { useStores } from '@/store/storeProvider';
import { ThemeModes } from '@/utils/enum/theme';
import { Breakpoints } from '@/utils/hook/screenSize';
import {
  APP_MENU_DEFAULT_OPENED_KEY,
  APP_MENU_DEFAULT_SELECTED_KEY,
} from '@/utils/constant';
import { AppMenu } from '../AppMenu';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const {
    CommonStore: {
      isCollapseSidebar,
      setIsCollapseSidebar,
      themeMode,
      screenWidth,
    },
  } = useStores();

  const denyExpandSidebar = screenWidth <= Breakpoints['tablet-lg'];

  return (
    <Sider
      collapsible={!denyExpandSidebar}
      collapsed={denyExpandSidebar || isCollapseSidebar}
      onCollapse={(value) => setIsCollapseSidebar(value)}
      className="silder"
    >
      <Image
        {...{
          src: whiteLogo,
          alt: 'App logo',
          width: 150,
          height: 80,
          className: 'logo',
        }}
      />
      <Menu
        theme={themeMode === ThemeModes['dark'] ? 'light' : 'dark'}
        defaultSelectedKeys={[APP_MENU_DEFAULT_SELECTED_KEY]}
        defaultOpenKeys={[APP_MENU_DEFAULT_OPENED_KEY]}
        mode="inline"
        items={AppMenu}
      />
    </Sider>
  );
};

export default observer(Sidebar);
