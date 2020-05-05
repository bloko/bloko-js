import identity from './getters/identity';
import isObject from './getters/isObject';

function createUnitBloko(descriptor) {
  create.__descriptor__ = normalizeDescriptor(descriptor);
  create.rules = getRules(descriptor);

  array.__descriptor__ = create.__descriptor__;
  array.__array__ = true;

  create.Array = array;
  create.Array.__array__ = true;
  create.Array.validate = validateArray;

  create.validate = validate;

  function validateArray(payload) {
    const _payload = Array.isArray(payload) ? payload : [payload];

    return _payload.map(validate).filter(v => v).length > 0;
  }

  function validate(payload) {
    try {
      return !!create(payload);
    } catch (error) {
      return false;
    }
  }

  function create(payload = {}) {
    let result = {};

    Object.keys(create.__descriptor__).forEach(key => {
      const { defaultValue, handler, rules } = create.__descriptor__[key];
      const value = payload[key];

      // console.log(handler, defaultValue);

      if (isBloko(handler)) {
        let tmp = create.__descriptor__;

        create.__descriptor__ = handler.__descriptor__;
        result[key] = handler.__array__ ? array(value) : create(value);

        create.__descriptor__ = tmp;
      } else if (value === undefined) {
        const _value = handler(value || defaultValue, payload);

        result[key] = _value;
      } else {
        const _value = handler(value || defaultValue, payload);

        rules.forEach(rule => {
          const errorMessage = rule(_value);

          if (typeof errorMessage === 'string') {
            throw new Error(errorMessage);
          }
        });

        result[key] = _value;
      }
    });

    return result;
  }

  function array(payload) {
    if (!payload) {
      return [];
    }

    const _payload = Array.isArray(payload) ? payload : [payload];

    return _payload.map(create);
  }

  return create;
}

function normalizeDescriptor(descriptor) {
  return Object.keys(descriptor).reduce((acc, key) => {
    const data = descriptor[key];

    let keyDescriptor = {
      defaultValue: data,
      handler: identity,
      rules: [],
    };

    if (isObject(data)) {
      keyDescriptor.defaultValue = data.value;

      if (data.handler) {
        keyDescriptor.handler = data.handler;
      }

      if (data.rules) {
        keyDescriptor.rules = Array.isArray(data.rules)
          ? data.rules
          : [data.rules];
      }
    } else if (typeof data === 'function') {
      keyDescriptor.defaultValue = undefined;
      keyDescriptor.handler = data;
    }

    acc[key] = keyDescriptor;

    return acc;
  }, {});
}

function getRules(descriptor) {
  return Object.keys(descriptor).reduce((acc, key) => {
    const data = descriptor[key];

    if (isObject(data) && data.rules) {
      acc[key] = Array.isArray(data.rules) ? data.rules : [data.rules];
    }

    return acc;
  }, {});
}

function isBloko(value) {
  return Boolean(value && value.__descriptor__);
}

export default createUnitBloko;
