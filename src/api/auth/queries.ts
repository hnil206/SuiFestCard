import { createQuery } from 'react-query-kit';

import { login } from './requests';
import { ILoginParams, ILoginResponse } from './types';

export const useLoginQuery = createQuery<ILoginResponse, ILoginParams>({
  queryKey: ['login'],
  fetcher: (variables) => login(variables),
});
