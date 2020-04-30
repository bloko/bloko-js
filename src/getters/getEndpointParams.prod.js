import { cache } from './state';

function getEndpointParams(endpoint, params) {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
  let cached = cache.get(cacheKey);

  if (!cached) {
    cached = endpoint
      .match(/:\w+/g)
      .reduce(
        (acc, param) => acc.replace(param, params[param.slice(1)]),
        endpoint
      );
  }

  return cached;
}

export default getEndpointParams;
