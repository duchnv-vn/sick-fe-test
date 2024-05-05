import { DeviceTypes, DeviceStatus } from '../enum/device';

export type Device = {
  _id: number;
  name: string;
  serialNumber: string;
  type: DeviceTypes;
  status: DeviceStatus;
  description: string;
  userId: number;
  deleteFlag: number;
};

export type DeviceType = `${DeviceTypes}` | 'ALL';

export type TabHeader = {
  key: string;
  label: string;
  children: JSX.Element;
};

export interface TableDataType {
  key: number;
  name: string;
  serialNumber: string;
  type: DeviceTypes;
  status: DeviceStatus;
}

export type FetchDevicesResponse = {
  isSuccess: boolean;
  devices: Record<string, Device[]>;
};

export type CreateDeviceBody = {
  name: string;
  serialNumber: string;
  userId: number;
  type: DeviceTypes;
  status: DeviceStatus;
  description?: string;
};

export type UpdateDeviceResponse = {
  isSuccess: boolean;
  device?: Device;
};

export type EditDeviceBody = {
  name?: string;
  serialNumber?: string;
  type?: DeviceTypes;
  status?: DeviceStatus;
  description?: string;
};
