import { makeAutoObservable } from 'mobx';
import { CommonStoreData } from '../type';
import { ThemeModes } from '@/utils/enum/theme';

class CommonStore {
  themeMode: ThemeModes | string = '';
  isOpenTicketModal = false;
  isCollapseSidebar = false;
  isAppLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setThemeMode = (mode: ThemeModes) => {
    this.themeMode = mode;
  };

  setIsCollapseSidebar = (status: boolean) => {
    this.isCollapseSidebar = status;
  };

  setIsAppLoading = (status: boolean) => {
    this.isCollapseSidebar = status;
  };

  hydrate = ({ mode }: CommonStoreData) => {
    mode && this.setThemeMode(mode);
  };
}

export default CommonStore;
