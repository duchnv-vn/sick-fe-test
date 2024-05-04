import { UserProfile } from '@auth0/nextjs-auth0/client';
import { ThemeModes } from '@/utils/enum/theme';
import { Device } from '@/utils/type/device.type';
import { DeviceTypes } from '@/utils/enum/device';

export type CommonStoreData = {
  mode?: ThemeModes;
};

export type UserStoreData = {
  user?: UserProfile;
};

type DeviceStatus = 'online' | 'offline';

export type DeviceStoreData = {
  devices?: Record<DeviceStatus, Device[]>;
};

export type DeviceNumberByTypes = Record<DeviceTypes, number>;
