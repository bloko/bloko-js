import http from './http';

export const {
  setBaseURL,
  setAuthorization,
  removeAuthorization,
  addRequestInterceptor,
  addResponseInterceptor,
} = http;
export { default as createService } from './createService';
