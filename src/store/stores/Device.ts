import { makeAutoObservable } from 'mobx';
import { Device } from '@/utils/type/device.type';
import { DeviceStatus, DeviceTypes } from '@/utils/enum/device';
import { DeviceNumberByTypes, DeviceStoreData } from '../type';

class DeviceStore {
  totalDeviceNumber = 0;
  totalOnlineDeviceNumber = 0;
  totalOfflineDeviceNumber = 0;
  deviceNumberByTypes: DeviceNumberByTypes = {} as DeviceNumberByTypes;
  onlineDevices: Device[] = [];
  offlineDevices: Device[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setDevicesByStatus = (devices: Device[], type: DeviceStatus) => {
    switch (type) {
      case 0:
        this.offlineDevices = devices;
        this.totalOfflineDeviceNumber = devices.length;
        break;

      case 1:
        this.onlineDevices = devices;
        this.totalOnlineDeviceNumber = devices.length;
        break;
    }
  };

  setDevices = (devices: Record<string, Device[]>) => {
    const { online, offline } = devices;
    let totalDevices = 0;

    if (online) {
      this.onlineDevices = online;
      this.totalOnlineDeviceNumber = online.length;
      totalDevices += online.length;
    }

    if (offline) {
      this.offlineDevices = offline;
      this.totalOfflineDeviceNumber = offline.length;
      totalDevices += offline.length;
    }

    this.totalDeviceNumber = totalDevices;
  };

  setDeviceNumberByTypes = (devices: Device[]) => {
    this.totalDeviceNumber = devices.length;

    devices.forEach(({ type }) => {
      const currentNumber = this.deviceNumberByTypes[type];
      if (!currentNumber) {
        this.deviceNumberByTypes[type] = 1;
      } else {
        this.deviceNumberByTypes[type] += 1;
      }
    });
  };

  getDevicesByTypes = (
    deviceType: `${DeviceTypes}` | 'ALL',
    status: DeviceStatus[] = [],
  ) => {
    let devices: Device[] = [];

    status.includes(0) && devices.push(...this.offlineDevices);
    status.includes(1) && devices.push(...this.onlineDevices);

    if (deviceType === 'ALL') return devices;

    devices = devices.filter(({ type }) => type === Number(deviceType));
    return devices;
  };

  hydrate = ({ devices }: DeviceStoreData) => {
    if (!devices) return;
    const { offline, online } = devices;
    this.setDevicesByStatus(offline, DeviceStatus['offline']);
    this.setDevicesByStatus(online, DeviceStatus['online']);
    this.setDeviceNumberByTypes([...offline, ...online]);
  };
}

export default DeviceStore;
