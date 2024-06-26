'use client';
import { ReactNode, createContext, useContext } from 'react';
import { message } from 'antd';
import UserStore from './stores/User';
import CommonStore from './stores/Common';
import { ThemeModes } from '@/utils/enum/theme';
import { useStore } from '.';
import DeviceStore from './stores/Device';

type RootStoreProps = {
  UserStore: UserStore;
  CommonStore: CommonStore;
  DeviceStore: DeviceStore;
};

export const StoreContext = createContext<RootStoreProps>({} as RootStoreProps);

export const StoreWrapper = ({ children }: { children: ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const ComonStoreValues = useStore('CommonStore', {
    mode: ThemeModes['light'],
    messageApiInstance: messageApi,
  });
  const UserStoreValues = useStore('UserStore', {});
  const DeviceStoreValues = useStore('DeviceStore', {});

  return (
    <StoreContext.Provider
      value={{
        CommonStore: ComonStoreValues,
        UserStore: UserStoreValues,
        DeviceStore: DeviceStoreValues,
      }}
    >
      {contextHolder}
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  return useContext(StoreContext);
};
