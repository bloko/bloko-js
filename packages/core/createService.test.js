import createService from './createService';
import http from './http';

describe('createService', () => {
  const repository = http.getInstance();

  beforeEach(() => {
    repository.mockReset();
  });

  it('should use correct query params with get method', () => {
    const options = {
      method: 'get',
      endpoint: '/',
    };
    const payload = { foo: 'bar' };

    const service = createService(options);

    service(payload);

    expect(repository).toHaveBeenCalledTimes(1);
    expect(repository).toHaveBeenCalledWith({
      method: options.method,
      endpoint: options.endpoint,
      params: payload,
    });
  });

  it('should use correct endpoints params and query params with get method', () => {
    const options = {
      method: 'get',
      endpoint: '/:id',
    };
    const payload = { id: 1, foo: 'bar' };
    const { id, ...restPayload } = payload;

    const service = createService(options);

    service(payload);

    expect(repository).toHaveBeenCalledTimes(1);
    expect(repository).toHaveBeenCalledWith({
      method: options.method,
      endpoint: options.endpoint.replace(':id', id),
      params: restPayload,
    });
  });

  it('should use correct endpoints params and body data with post method', () => {
    const options = {
      method: 'post',
      endpoint: '/:id',
    };
    const payload = { id: 1, foo: 'bar' };
    const { id, ...restPayload } = payload;

    const service = createService(options);

    service(payload);

    expect(repository).toHaveBeenCalledTimes(1);
    expect(repository).toHaveBeenCalledWith({
      method: options.method,
      endpoint: options.endpoint.replace(':id', id),
      data: restPayload,
    });
  });

  it('should use correct key prop for payload request data', () => {
    const payload = { foo: 'bar' };

    const getService = createService({ method: 'get' });
    const postService = createService({ method: 'post' });
    const putService = createService({ method: 'put' });
    const patchService = createService({ method: 'patch' });
    const deleteService = createService({ method: 'delete' });

    assertDataKeyProp(getService, 'params');
    assertDataKeyProp(postService, 'data');
    assertDataKeyProp(putService, 'data');
    assertDataKeyProp(patchService, 'data');
    assertDataKeyProp(deleteService, 'params');

    function assertDataKeyProp(service, key) {
      service(payload);

      expect(repository).toHaveBeenCalledTimes(1);
      expect(repository).toHaveBeenCalledWith(
        expect.objectContaining({ [key]: payload })
      );

      repository.mockReset();
    }
  });
});
