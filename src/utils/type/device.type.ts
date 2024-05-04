import { DeviceTypes, DeviceStatus } from '../enum/device';

export type Device = {
  _id: number;
  name: string;
  serialNumber: number;
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
  serialNumber: number;
  type: DeviceTypes;
  status: DeviceStatus;
}
