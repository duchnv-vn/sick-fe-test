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
