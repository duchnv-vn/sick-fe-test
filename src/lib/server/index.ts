import HttpService from '../http';
import {
  UpdateDeviceResponse,
  CreateDeviceBody,
  Device,
  FetchDevicesResponse,
  EditDeviceBody,
} from '@/utils/type/device.type';
import { DeviceStatus } from '@/utils/enum/device';

type BaseResponse<T> = {
  data: T;
  message: string;
  statusCode: number;
};

const MAX_TIMEOUT = 1 * 60 * 1000;

class Singleton {
  private static _instance: Singleton;
  private client: HttpService;

  private constructor() {
    this.client = new HttpService({
      baseURL: `${process.env.APP_DOMAIN}/api`,
      timeout: MAX_TIMEOUT,
    });
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }

    return this._instance;
  }

  getDevices = async (): Promise<FetchDevicesResponse> => {
    try {
      const devices = await this.client.get<BaseResponse<Device[]>>('/devices');
      const filteredDevices = this.divideDevicesByStatus(devices.data.data);

      return {
        devices: filteredDevices,
        isSuccess: true,
      };
    } catch (error) {
      return { devices: {}, isSuccess: false };
    }
  };

  createDevice = async (
    payload: CreateDeviceBody,
  ): Promise<UpdateDeviceResponse> => {
    try {
      const {
        data: { data },
      } = await this.client.post<BaseResponse<Device>>('/devices', payload);

      return { isSuccess: true, device: data };
    } catch {
      return { isSuccess: false };
    }
  };

  editDevice = async (payload: EditDeviceBody, deviceId: number) => {
    try {
      const {
        data: { data },
      } = await this.client.put<BaseResponse<Device>>(
        `/devices/${deviceId}`,
        payload,
      );

      return { isSuccess: true, device: data };
    } catch {
      return { isSuccess: false };
    }
  };

  deleteDevice = async (deviceId: number) => {
    try {
      const isSuccess = await this.client.delete<BaseResponse<boolean>>(
        `/devices/${deviceId}`,
      );
      return { isSuccess };
    } catch {
      return { isSuccess: false };
    }
  };

  private divideDevicesByStatus(devices: Device[]) {
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
