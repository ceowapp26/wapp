import { initEdgeStore } from '@edgestore/server';
import {
  type CreateContextOptions,
  createEdgeStoreNextHandler,
} from '@edgestore/server/adapters/next/app';

import { z } from 'zod';
 
 
type Context = {
  userId: string;
  userRole: 'admin' | 'user';
};
 
async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const { id, role } = await getUserSession(req); // replace with your own session logic
 
  return {
    userId: '123',
    userRole: 'admin',
  };
}
 
const es = initEdgeStore.context<Context>().create();
 
/**
 * This is the main router for the Edge Store buckets.
 */
export const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 10, // 10MB
      accept: ['image/jpeg', 'image/png', 'image/jpg'], 
    })
    /**
     * return `true` to allow upload
     * By default every upload from your app is allowed.
     */
    .beforeUpload(({ ctx, input, fileInfo }) => {
      return true; // allow upload
    })
    /**
     * return `true` to allow delete
     * This function must be defined if you want to delete files directly from the client.
     */
    .beforeDelete(({ ctx, fileInfo }) => {
      return true; // allow delete
    }),
});

 
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});
 
export { handler as GET, handler as POST };
 
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;

