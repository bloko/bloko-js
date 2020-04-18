import http from './http';

describe('http', () => {
  beforeEach(() => {
    http.destroy();
  });

  it('should handle baseURL', () => {
    const instance = http.instance();
    const url = 'https://example.com';
    const getBaseURL = () => instance.defaults.baseURL;

    expect(getBaseURL()).toEqual(undefined);

    http.setBaseURL(url);

    expect(getBaseURL()).toEqual(url);
  });

  it('should handle Authorization', () => {
    const instance = http.instance();
    const token = 'Bearer token';
    const getAuth = () => instance.defaults.headers.common['Authorization'];

    expect(getAuth()).toEqual(undefined);

    http.setAuthorization(token);

    expect(getAuth()).toEqual(token);

    http.removeAuthorization();

    expect(getAuth()).toEqual(undefined);
  });

  it('should handle request/response interceptor', () => {
    const instance = http.instance();
    const success = config => config.data;
    const error = error => Promise.reject(error);
    const getInterceptor = type => instance.interceptors[type].handlers[0];

    http.setRequestInterceptor(success, error);

    http.setResponseInterceptor(success, error);

    const requestInterceptor = getInterceptor('request');
    const responseInterceptor = getInterceptor('response');

    const resolved = { data: 'foo ' };
    const rejected = {
      response: {
        statusText: 'text',
        status: 404,
        data: { message: 'message' },
      },
    };

    expect(requestInterceptor.fulfilled(resolved)).toEqual(resolved.data);
    expect(requestInterceptor.rejected(rejected)).rejects.toMatchObject(
      rejected
    );

    expect(responseInterceptor.fulfilled(resolved)).toEqual(resolved.data);
    expect(responseInterceptor.rejected(rejected)).rejects.toMatchObject(
      rejected
    );
  });

  it('should create only one request/response interceptor handler', () => {
    const instance = http.instance();
    const success = config => config.data;
    const error = error => Promise.reject(error);
    const getInterceptorsLength = type =>
      instance.interceptors[type].handlers.length;

    http.setRequestInterceptor(success, error);
    http.setRequestInterceptor(success, error);
    http.setRequestInterceptor(success, error);

    http.setResponseInterceptor(success, error);
    http.setResponseInterceptor(success, error);
    http.setResponseInterceptor(success, error);

    expect(getInterceptorsLength('request')).toEqual(1);
    expect(getInterceptorsLength('response')).toEqual(1);
  });
});
