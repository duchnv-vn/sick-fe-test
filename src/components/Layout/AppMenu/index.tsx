import { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

export const AppMenu: MenuItem[] = [
  getItem('Entities', 'sub-1', <UserOutlined />, [
    getItem(
      'Device',
      '1',
      <FontAwesomeIcon icon={faComputer} className="w-5 h-5" />,
    ),
  ]),
];
