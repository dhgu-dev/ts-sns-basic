import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

type METHOD = 'get' | 'post' | 'put' | 'delete';

const fetcher = async (method: METHOD, url: string, ...rest: any[]) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

export default fetcher;
