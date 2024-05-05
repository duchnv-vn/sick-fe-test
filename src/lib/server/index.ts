import { getSession } from '@auth0/nextjs-auth0';
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

  async getAuthorization() {
    const session = await getSession();
    return `Bearer ${session?.accessToken}`;
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
      console.log('------------------------');
      console.log('error', error);
      console.log('------------------------');
      return { devices: {}, isSuccess: false };
    }
  }

  async getDevicesServerSide(): Promise<FetchDevicesResponse> {
    try {
      const accessToken = await this.getAuthorization();
      const res = await fetch(`${process.env.AUTH0_AUDIENCE}api/devices`, {
        next: { revalidate: 10 },
        headers: { authorization: accessToken },
      });
      const devices = (await res.json()) as BaseResponse<Device[]>;
      const filteredDevices = Singleton.divideDevicesByStatus(devices.data);

      return {
        devices: filteredDevices,
        isSuccess: true,
      };
    } catch (error) {
      return { devices: {}, isSuccess: false };
    }
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
}

const serverService = Singleton.instance;
export default serverService;
