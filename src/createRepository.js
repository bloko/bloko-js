import getEndpointParams from './getters/getEndpointParams';
import http from './http';

function createRepository(repositoryString, options = {}) {
  let [method, endpoint] = repositoryString.split(' ');
  let _method = method.toLowerCase();
  let _endpoint = endpoint;

  if (options.params) {
    _endpoint = getEndpointParams(_endpoint, options.params);
  }

  return function (payload) {
    const requestParams = buildRequestParams(
      _method,
      _endpoint,
      payload,
      options
    );

    return http.instance()[_method].apply(null, requestParams);
  };
}

function buildRequestParams(method, endpoint, payload, options) {
  let requestParams = [endpoint];

  if (method === 'post' || method === 'put' || method === 'patch') {
    requestParams.push(payload);
  }

  if (options.query) {
    requestParams.push({ params: options.query });
  }

  return requestParams;
}

export default createRepository;
