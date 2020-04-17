jest.mock('./packages/core/http', () => {
  const http = jest.requireActual('./packages/core/http');
  let mockFn;

  return {
    ...http,
    getInstance() {
      if (!mockFn) {
        mockFn = jest.fn();
      }

      return mockFn;
    },
  };
});
