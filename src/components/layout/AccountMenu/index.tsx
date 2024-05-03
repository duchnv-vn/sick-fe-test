'use client';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import type { MenuProps } from 'antd';
import { Dropdown, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { useStores } from '@/store/storeProvider';
import Image from '@/components/elements/Image';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href="#">Account</Link>,
  },
  {
    key: '2',
    label: <Link href="/api/auth/logout">Logout</Link>,
  },
];

const AccountMenu: React.FC = () => {
  const {
    UserStore: {
      user: { picture, name },
    },
    CommonStore: { setIsAppLoading },
  } = useStores();

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button
        {...{
          className: 'account-button',
          onClick: () => {
            setIsAppLoading(true);
          },
          children: (
            <div className="button-inner">
              {picture && (
                <Image
                  {...{
                    src: picture as string,
                    alt: name as string,
                    width: 35,
                    height: 35,
                    className: 'user-avatar',
                  }}
                />
              )}
              <span className="user-name">{name}</span>
              <FontAwesomeIcon icon={faEllipsisV} className="w-5 h-5" />
            </div>
          ),
        }}
      />
    </Dropdown>
  );
};

export default observer(AccountMenu);
