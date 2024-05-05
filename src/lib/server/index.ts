import HttpService from '../http';
import { Device, FetchDevicesResponse } from '@/utils/type/device.type';
import { DeviceStatus } from '@/utils/enum/device';

type BaseResponse<T> = {
  data: T;
  message: string;
  statusCode: number;
};

const MAX_TIMEOUT = 1 * 60 * 1000;

class Singleton {
  private static _instance: Singleton;
  private static client = new HttpService({
    baseURL: `${process.env.APP_DOMAIN}/api`,
    timeout: MAX_TIMEOUT,
  });

  private constructor() {}
  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }

    return this._instance;
  }

  static divideDevicesByStatus(devices: Device[]) {
    const result = {
      online: [],
      offline: [],
    } as unknown as Record<string, Device[]>;

    devices.forEach((device) => {
      result[DeviceStatus[device.status]].push(device);
    });

    return result;
  }

  async getDevices(): Promise<FetchDevicesResponse> {
    try {
      const devices =
        await Singleton.client.get<BaseResponse<Device[]>>('/devices');
      const filteredDevices = Singleton.divideDevicesByStatus(
        devices.data.data,
      );

      return {
        devices: filteredDevices,
        isSuccess: true,
      };
    } catch (error) {
      return { devices: {}, isSuccess: false };
    }
  }
}

const serverService = Singleton.instance;
export default serverService;
