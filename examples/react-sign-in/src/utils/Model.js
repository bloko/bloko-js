import * as RULES from './rules';

class Model {
  constructor(props) {
    this.validate(props);
  }

  toJSON() {
    const json = {};

    Object.getOwnPropertyNames(this).forEach(key => {
      json[key] = this[key];
    });

    return json;
  }

  getRules() {
    return this.rules && this.rules();
  }

  getChildrenModelName() {
    return this.constructor['displayName'];
  }

  getEmptyValue(value) {
    switch (typeof value) {
      case 'object':
        return Array.isArray(value) ? '[]' : '{}';
      default:
        return "''";
    }
  }

  validate(props) {
    const childrenRules = this.getRules();

    const childrenModelName = this.getChildrenModelName();

    if (childrenRules) {
      Object.keys(childrenRules).forEach(propName => {
        const value = props[propName];

        const rules = childrenRules[propName];
        const propRules = Array.isArray(rules) ? rules : [rules];

        propRules.forEach(propRule => {
          const { rule, onError } = propRule;

          const [ruleName, ...params] = rule.split('.');
          // const ruleFn = typeof ruleName === 'function' ? ruleName : RULES[ruleName];
          const ruleFn = RULES[ruleName];
          const isNotValid = !ruleFn(...params, value);

          if (isNotValid) {
            const message = 
            `Model ${childrenModelName} has invalid ${propName} prop for rule ${ruleName} (value: ${
              value || this.getEmptyValue(value)
            })`
          
            const error = new Error(onError);

            error.bloko = {
              model: childrenModelName,
              ruleName,
              key: propName,
              value,
              message,
            }

            throw error;
          }
        });
      });
    }
  }
}

export default Model;
