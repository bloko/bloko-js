import http from './http';
import service from './service';

describe('service', () => {
  const instance = http.instance();

  it('should use correct query params with get method', () => {
    const endpoint = '/';
    const query = { foo: 'bar' };

    const handler = service.get(endpoint);

    handler({ query });

    expect(instance.get).toHaveBeenCalledTimes(1);
    expect(instance.get).toHaveBeenCalledWith(endpoint, {
      params: query,
    });
  });

  it('should use correct endpoints params and query params with get method', () => {
    const endpoint = '/:id';
    const query = { foo: 'bar' };
    const params = { id: 1 };

    const handler = service.get(endpoint);

    handler({ query, params });

    expect(instance.get).toHaveBeenCalledTimes(1);
    expect(instance.get).toHaveBeenCalledWith(
      endpoint.replace(':id', params.id),
      {
        params: query,
      }
    );
  });

  it('should use correct endpoints params and body data with post method', () => {
    const endpoint = '/:id';
    const data = { foo: 'bar' };
    const params = { id: 1 };

    const handler = service.post(endpoint);

    handler({ data, params });

    expect(instance.post).toHaveBeenCalledTimes(1);
    expect(instance.post).toHaveBeenCalledWith(
      endpoint.replace(':id', params.id),
      data
    );
  });

  it('should use correct endpoints params, body data and query params with post method', () => {
    const endpoint = '/:id';
    const data = { foo: 'bar' };
    const query = { foo: 'bar' };
    const params = { id: 1 };

    const handler = service.post(endpoint);

    handler({ data, query, params });

    expect(instance.post).toHaveBeenCalledTimes(1);
    expect(instance.post).toHaveBeenCalledWith(
      endpoint.replace(':id', params.id),
      data,
      { params: query }
    );
  });

  it('should use correct key prop for payload request data', () => {
    const allowedMethods = [
      'get',
      'post',
      'put',
      'delete',
      'patch',
      'head',
      'options',
    ];

    allowedMethods.forEach(method => {
      const buildService = service[method];
      const handler = buildService();

      handler();

      expect(instance[method]).toHaveBeenCalledTimes(1);
    });
  });
});
