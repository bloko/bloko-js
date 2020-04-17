import http from './http';

const repository = http.getInstance();

function createService(config) {
  let params = getParams(config.endpoint);

  function execute(payload) {
    let _endpoint = config.endpoint;
    let _params = Object.assign({}, payload);
    let dataKey =
      ['get', 'delete'].indexOf(config.method) > -1 ? 'params' : 'data';

    params.forEach((param) => {
      _endpoint = _endpoint.replace(':' + param, _params[param]);
      delete _params[param];
    });

    return repository({
      method: config.method,
      endpoint: _endpoint,
      [dataKey]: _params,
    });
  }

  function getParams(endpoint) {
    try {
      return endpoint.match(/:\w+/g).map((param) => {
        // remove : character
        return param.slice(1);
      });
    } catch (error) {
      return [];
    }
  }

  return execute;
}

export default createService;
