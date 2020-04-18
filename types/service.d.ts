import { HttpPromise } from './http';

declare module service {
  type PayloadObject = { [key: string]: string | number | null | undefined };
  type Payload = { query?: PayloadObject, params?: PayloadObject, data?: PayloadObject };
  type Handler = (payload?: Payload) => HttpPromise;
  type BuildHandler = (endpoint: string, options?: object) => Handler;

  export const get: BuildHandler;
  export const post: BuildHandler;
  export const put: BuildHandler;
  export const delete: BuildHandler;
  export const patch: BuildHandler;
  export const head: BuildHandler;
  export const options: BuildHandler;
}
