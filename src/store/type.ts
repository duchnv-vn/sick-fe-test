import { UserProfile } from '@auth0/nextjs-auth0/client';
import { MessageInstance } from 'antd/es/message/interface';
import { ThemeModes } from '@/utils/enum/theme';
import { Device } from '@/utils/type/device.type';
import { DeviceTypes } from '@/utils/enum/device';

export type CommonStoreData = {
  mode?: ThemeModes;
  messageApiInstance?: MessageInstance;
};

export type UserStoreData = {
  user?: UserProfile;
};

type DeviceStatus = 'online' | 'offline';

export type DeviceStoreData = {
  devices?: Record<DeviceStatus, Device[]>;
};

export type DeviceNumberByTypes = Record<DeviceTypes, number>;
