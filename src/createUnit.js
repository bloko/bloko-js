import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

function createUnit(descriptor) {
  const { props, derivated } = normalizeDescriptor(descriptor);

  create.__props__ = props;
  create.__derivated__ = derivated;
  create.rules = getRules(descriptor);

  array.__props__ = create.__props__;
  array.__derivated__ = create.__derivated__;
  array.__array__ = true;

  create.Array = array;
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

  function create(payload) {
    let result = {};

    Object.keys(create.__props__).forEach(key => {
      const { handler, rules } = create.__props__[key];
      const value = payload && payload[key];

      if (isBloko(handler)) {
        let tmpProps = create.__props__;
        let tmpDerivated = create.__derivated__;

        create.__props__ = handler.__props__;
        create.__derivated__ = handler.__derivated__;

        result[key] = handler.__array__ ? array(value) : create(value);

        create.__props__ = tmpProps;
        create.__derivated__ = tmpDerivated;
      } else {
        let _value = value || handler;

        if (isFunction(handler)) {
          _value = handler(value);
        }

        if (payload && payload.hasOwnProperty(key)) {
          rules.forEach(rule => {
            const errorMessage = rule(_value);

            if (typeof errorMessage === 'string') {
              throw new Error(errorMessage);
            }
          });
        }

        result[key] = _value;
      }
    });

    Object.keys(create.__derivated__).forEach(key => {
      const handler = create.__derivated__[key];

      result[key] = handler.call(result);
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
  let derivated = {};
  let props = {};

  Object.keys(descriptor).forEach(key => {
    const data = descriptor[key];

    let keyDescriptor = {
      handler: data,
      rules: [],
    };

    if (!isBloko(data) && isFunction(data)) {
      derivated[key] = data;
    } else {
      if (isObject(data)) {
        keyDescriptor.handler = data.value;

        if (data.rules) {
          keyDescriptor.rules = Array.isArray(data.rules)
            ? data.rules
            : [data.rules];
        }
      }

      props[key] = keyDescriptor;
    }
  });

  return {
    derivated,
    props,
  };
}

function getRules(descriptor) {
  return Object.keys(descriptor).reduce((acc, key) => {
    const data = descriptor[key];

    if (isObject(data) && data.rules) {
      acc[key] = Array.isArray(data.rules) ? data.rules : [data.rules];
    }

    if (isBloko(data)) {
      acc[key] = getRules(data.__props__);
    }

    return acc;
  }, {});
}

function isBloko(value) {
  return Boolean(value && value.__props__);
}

export default createUnit;
