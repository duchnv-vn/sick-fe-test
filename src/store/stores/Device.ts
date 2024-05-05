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
  deviceToEdit: Device | null | undefined = null;

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

    status.includes(1) && devices.push(...this.onlineDevices);
    status.includes(0) && devices.push(...this.offlineDevices);

    if (deviceType === 'ALL') return devices;

    devices = devices.filter(({ type }) => type === Number(deviceType));
    return devices;
  };

  addDevice = (device: Device) => {
    const isOnlineDevice = device.status == DeviceStatus['online'];

    if (isOnlineDevice) {
      this.onlineDevices = [device, ...this.onlineDevices];
      this.totalOnlineDeviceNumber += 1;
    } else {
      this.offlineDevices = [device, ...this.offlineDevices];
      this.totalOfflineDeviceNumber += 1;
    }

    this.totalDeviceNumber += 1;
    const newNumberByType = this.deviceNumberByTypes[device.type] + 1;
    this.deviceNumberByTypes[device.type] = newNumberByType;
  };

  updateDevice = (device: Device) => {
    const isOnlineDevice = device.status == DeviceStatus['online'];

    const onlineIndex = this.onlineDevices.findIndex(
      (item) => item._id === device._id,
    );
    const offlineIndex = this.offlineDevices.findIndex(
      (item) => item._id === device._id,
    );

    if (isOnlineDevice) {
      if (offlineIndex !== -1) {
        this.offlineDevices.splice(offlineIndex, 1);
        this.totalOfflineDeviceNumber -= 1;
      }

      if (onlineIndex !== -1) {
        const newData = [...this.onlineDevices];
        newData[onlineIndex] = device;
        this.onlineDevices = newData;
      } else {
        this.onlineDevices = [device, ...this.onlineDevices];
        this.totalOnlineDeviceNumber += 1;
      }
    } else {
      if (onlineIndex !== -1) {
        this.onlineDevices.splice(onlineIndex, 1);
        this.totalOnlineDeviceNumber -= 1;
      }

      if (offlineIndex !== -1) {
        const newData = [...this.offlineDevices];
        newData[offlineIndex] = device;
        this.offlineDevices = newData;
      } else {
        this.offlineDevices = [device, ...this.offlineDevices];
        this.totalOfflineDeviceNumber += 1;
      }
    }
  };

  setDeviceToEdit = (id: number | null = null) => {
    if (isNaN(Number(id))) return (this.deviceToEdit = null);

    this.deviceToEdit = [...this.onlineDevices, ...this.offlineDevices].find(
      (device) => device._id === id,
    );
  };

  removeDevice = (id: number, status: DeviceStatus, type: DeviceTypes) => {
    const isOnlineDevice = status == DeviceStatus['online'];

    if (isOnlineDevice) {
      this.onlineDevices = this.onlineDevices.filter(({ _id }) => _id !== id);
      this.totalOnlineDeviceNumber -= 1;
    } else {
      this.offlineDevices = this.offlineDevices.filter(({ _id }) => _id !== id);
      this.totalOfflineDeviceNumber -= 1;
    }

    this.totalDeviceNumber -= 1;
    const newNumberByType = this.deviceNumberByTypes[type] - 1;
    this.deviceNumberByTypes[type] = newNumberByType;
  };

  hydrate = ({ devices }: DeviceStoreData) => {
    if (!devices) return;
    const { offline, online } = devices;
    offline && this.setDevicesByStatus(offline, DeviceStatus['offline']);
    online && this.setDevicesByStatus(online, DeviceStatus['online']);
    offline && online && this.setDeviceNumberByTypes([...offline, ...online]);
  };
}

export default DeviceStore;
