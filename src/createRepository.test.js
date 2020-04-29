import createRepository from './createRepository';
import http from './utils/http';

const instance = http.instance();

describe('createRepository', () => {
  it('should use correct query params with get method', () => {
    const method = 'get';
    const endpoint = '/';
    const query = { foo: 'bar' };
    const repositoryString = `${method.toUpperCase()} ${endpoint}`;

    const handler = createRepository(repositoryString, { query });

    handler();

    expect(instance[method]).toHaveBeenCalledTimes(1);
    expect(instance[method]).toHaveBeenCalledWith(endpoint, {
      params: query,
    });
  });

  it('should use correct endpoints params and query params with get method', () => {
    const method = 'get';
    const endpoint = '/:id';
    const query = { foo: 'bar' };
    const params = { id: 1 };
    const repositoryString = `${method.toUpperCase()} ${endpoint}`;

    const handler = createRepository(repositoryString, { query, params });

    handler();

    expect(instance[method]).toHaveBeenCalledTimes(1);
    expect(instance[method]).toHaveBeenCalledWith(
      endpoint.replace(':id', params.id),
      {
        params: query,
      }
    );
  });

  it('should throw an error when are using endpoint params and not in endpoint path', () => {
    const method = 'get';
    const endpoint = '/';
    const params = { id: 1 };
    const repositoryString = `${method.toUpperCase()} ${endpoint}`;

    function fn() {
      createRepository(repositoryString, { params });
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"Cannot found params id in endpoint /"`
    );
  });

  it('should throw an error when are using non existing endpoint params', () => {
    const method = 'get';
    const endpoint = '/:foo';
    const params = { id: 1 };
    const repositoryString = `${method.toUpperCase()} ${endpoint}`;

    function fn() {
      createRepository(repositoryString, { params });
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"Cannot found param foo in params object { id }"`
    );
  });

  it('should use correct endpoints params, query and body data with post method', () => {
    const method = 'post';
    const endpoint = '/:id';
    const query = { foo: 'bar' };
    const data = { foo: 'bar' };
    const params = { id: 1 };
    const repositoryString = `${method.toUpperCase()} ${endpoint}`;

    const handler = createRepository(repositoryString, { query, params });

    handler(data);

    expect(instance[method]).toHaveBeenCalledTimes(1);
    expect(instance[method]).toHaveBeenCalledWith(
      endpoint.replace(':id', params.id),
      data,
      {
        params: query,
      }
    );
  });

  it('should use correct method for each allowed http verb', () => {
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
      const endpoint = '/';
      const repositoryString = `${method.toUpperCase()} ${endpoint}`;
      const handler = createRepository(repositoryString);

      handler();

      expect(instance[method]).toHaveBeenCalledTimes(1);
    });
  });
});
