import { makeAutoObservable } from 'mobx';
import { CommonStoreData } from '../type';
import { ThemeModes } from '@/utils/enum/theme';
import { ArgsProps, MessageInstance } from 'antd/es/message/interface';

class CommonStore {
  messageApi: MessageInstance | null = null;
  themeMode: ThemeModes | string = '';
  isOpenTicketModal = false;
  isCollapseSidebar = false;
  isAppLoading = false;
  isDeviceModalOpen = false;
  isCreateModal = true;

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

  displayMessage = (payload: ArgsProps) => {
    this.messageApi && this.messageApi.open(payload);
  };

  setIsDeviceModalOpen = (status: boolean, isCreate: boolean = true) => {
    this.isDeviceModalOpen = status;
    this.isCreateModal = isCreate;
  };

  hydrate = ({ mode, messageApiInstance }: CommonStoreData) => {
    mode && this.setThemeMode(mode);
    messageApiInstance && (this.messageApi = messageApiInstance);
  };
}

export default CommonStore;
