import { cache } from './state';

function getEndpointParams(endpoint, params) {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
  let cached = cache.get(cacheKey);

  if (!cached) {
    const matchParams = endpoint.match(/:\w+/g);

    if (!matchParams) {
      const paramKeys = Object.keys(params).join(', ');

      throw new Error(
        `Cannot found params ${paramKeys} in endpoint ${endpoint}`
      );
    }

    cached = matchParams.reduce((acc, param) => {
      // remove :
      const key = param.slice(1);
      const value = params[key];

      if (!value) {
        const paramKeys = Object.keys(params).join(', ');

        throw new Error(
          `Cannot found param ${key} in params object { ${paramKeys} }`
        );
      }

      return acc.replace(param, value);
    }, endpoint);

    cache.set(cacheKey, cached);
  }

  return cached;
}

export default getEndpointParams;
