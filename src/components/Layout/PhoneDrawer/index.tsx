'use client';
import { observer } from 'mobx-react-lite';
import { Drawer, Menu } from 'antd';
import Image from '@/components/Elements/Image';
import logo from '../../../assets/image/logo.png';
import { useStores } from '@/store/storeProvider';
import { ThemeModes } from '@/utils/enum/theme';
import {
  APP_MENU_DEFAULT_OPENED_KEY,
  APP_MENU_DEFAULT_SELECTED_KEY,
} from '@/utils/constant';
import { AppMenu } from '../AppMenu';

import './index.scss';

const PhoneDrawer: React.FC = () => {
  const {
    CommonStore: { isOpenPhoneDrawer, setIsOpenPhoneDrawer, themeMode },
  } = useStores();

  return (
    <Drawer
      title={
        <Image
          {...{
            src: logo,
            alt: 'App logo',
            width: 50,
            height: 50,
            className: 'logo',
          }}
        />
      }
      placement={'left'}
      closable={false}
      onClose={() => setIsOpenPhoneDrawer(false)}
      open={isOpenPhoneDrawer}
    >
      <Menu
        theme={ThemeModes[themeMode as ThemeModes]}
        defaultSelectedKeys={[APP_MENU_DEFAULT_SELECTED_KEY]}
        defaultOpenKeys={[APP_MENU_DEFAULT_OPENED_KEY]}
        mode="inline"
        items={AppMenu}
      />
    </Drawer>
  );
};

export default observer(PhoneDrawer);
