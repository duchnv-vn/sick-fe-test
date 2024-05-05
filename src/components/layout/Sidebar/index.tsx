'use client';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import Image from '@/components/elements/Image';
import whiteLogo from '../../../assets/image/white_logo.svg';
import { useStores } from '@/store/storeProvider';
import { ThemeModes } from '@/utils/enum/theme';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Entities', 'sub-1', <UserOutlined />, [
    getItem(
      'Device',
      '1',
      <FontAwesomeIcon icon={faComputer} className="w-5 h-5" />,
    ),
  ]),
];

const DEFAULT_SELECTED_KEY = '1';
const DEFAULT_OPENED_KEY = 'sub-1';

const Sidebar: React.FC = () => {
  const {
    CommonStore: { isCollapseSidebar, setIsCollapseSidebar, themeMode },
  } = useStores();

  return (
    <Sider
      collapsible
      collapsed={isCollapseSidebar}
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
        defaultSelectedKeys={[DEFAULT_SELECTED_KEY]}
        defaultOpenKeys={[DEFAULT_OPENED_KEY]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default observer(Sidebar);
