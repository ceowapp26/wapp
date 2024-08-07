import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});