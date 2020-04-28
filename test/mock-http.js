jest.mock('../packages/js/src/http', () => {
  const http = jest.requireActual('../packages/js/src/http').default;
  const mocks = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    head: jest.fn(),
    options: jest.fn(),
  };

  return {
    ...http,
    instance() {
      return {
        ...http.instance(),
        ...mocks,
      };
    },
  };
});

// auto cleanup if test runner supports afterEach function
if (typeof afterEach === 'function') {
  afterEach(() => {
    const http = require('../packages/js/src/http');
    const instance = http.instance();

    instance.get.mockReset();
    instance.post.mockReset();
    instance.put.mockReset();
    instance.patch.mockReset();
    instance.delete.mockReset();
    instance.head.mockReset();
    instance.options.mockReset();
  });
}
