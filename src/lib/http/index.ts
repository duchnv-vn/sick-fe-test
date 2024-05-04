import axios, {
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';

class HttpService {
  private client: Axios;

  constructor(options: CreateAxiosDefaults) {
    this.client = axios.create({
      ...options,
    });
  }

  get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T, any>> {
    return this.client.get(url, config);
  }

  post<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T, any>> {
    return this.client.post(url, data, config);
  }

  put<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T, any>> {
    return this.client.put(url, data, config);
  }

  patch<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T, any>> {
    return this.client.patch(url, data, config);
  }

  delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T, any>> {
    return this.client.delete(url, config);
  }
}

export default HttpService;
