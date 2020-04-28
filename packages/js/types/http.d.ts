import { AxiosInstance, AxiosPromise } from 'axios';

export type HttpPromise = AxiosPromise;

declare module http {
  type Fulfilled = (value: V) => V | Promise<V>;
  type Rejected = (error: any) => any | void;

  export function instance(): AxiosInstance;
  export function destroy(): void;
  export function setBaseURL(url: string): void;
  export function setAuthorization(token: string): void;
  export function removeAuthorization(): void;
  export function setRequestInterceptor(onFulfilled?: Fulfilled, onRejected?: Rejected): void;
  export function setResponseInterceptor(onFulfilled?: Fulfilled, onRejected?: Rejected): void;
}
