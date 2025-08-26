import axiosClient from '../axiosClient';
import { ILoginParams, ILoginResponse } from './types';

export function login(params: ILoginParams): Promise<ILoginResponse> {
  return axiosClient.post('', params);
}
