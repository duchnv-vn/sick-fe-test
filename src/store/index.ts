import { enableStaticRendering } from 'mobx-react-lite';
import CommonStore from './stores/Common';
import UserStore from './stores/User';
import { CommonStoreData, DeviceStoreData, UserStoreData } from './type';
import DeviceStore from './stores/Device';

type InitData = CommonStoreData | UserStoreData | DeviceStoreData;
type StoreType = UserStore | CommonStore | DeviceStore;
const Stores = {
  UserStore,
  CommonStore,
  DeviceStore,
};
type StoresType = typeof Stores;

enableStaticRendering(typeof window === 'undefined');
let clientStores: Record<string, StoreType> = {};

const initStore = (initData: any, storeName: keyof StoresType) => {
  const StoreClass = Stores[storeName];
  const store = clientStores[storeName] ?? new StoreClass();

  if (initData) store.hydrate(initData);

  if (typeof window === 'undefined') return store;
  if (!clientStores[storeName]) clientStores[storeName] = store;
  return store;
};

export function useStore(storeName: keyof StoresType, initData: InitData): any {
  return initStore(initData, storeName);
}
