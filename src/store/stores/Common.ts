import { makeAutoObservable } from 'mobx';
import { CommonStoreData } from '../type';
import { ThemeModes } from '@/utils/enum/theme';

class CommonStore {
  themeMode: ThemeModes | string = '';
  isOpenTicketModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setThemeMode = (mode: ThemeModes) => {
    this.themeMode = mode;
  };

  hydrate = ({ mode }: CommonStoreData) => {
    mode && this.setThemeMode(mode);
  };
}

export default CommonStore;
