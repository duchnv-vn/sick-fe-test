'use client';
import { ReactNode, createContext, useContext } from 'react';
import UserStore from './stores/User';
import CommonStore from './stores/Common';
import { ThemeModes } from '@/utils/enum/theme';
import { useStore } from '.';

type RootStoreProps = {
  UserStore: UserStore;
  CommonStore: CommonStore;
};

export const StoreContext = createContext<RootStoreProps>({} as RootStoreProps);

export const StoreWrapper = ({ children }: { children: ReactNode }) => {
  const ComonStoreValues = useStore('CommonStore', {
    mode: ThemeModes['theme-light'],
  });
  const UserStoreValues = useStore('UserStore', {
    user: dummyUser,
  });

  return (
    <StoreContext.Provider
      value={{
        CommonStore: ComonStoreValues,
        UserStore: UserStoreValues,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  return useContext(StoreContext);
};
