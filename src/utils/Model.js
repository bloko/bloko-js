class Model {
  constructor(props = {}) {
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

          const isNotValid = !rule(value);

          if (isNotValid) {
            const ruleName = rule.name;
            const currentValue = JSON.stringify(value);
            const message = `Model ${childrenModelName} has invalid ${propName} prop for rule ${ruleName} (value: ${currentValue})`;

            const error = new Error(onError);

            error.bloko = {
              model: childrenModelName,
              ruleName: rule.name,
              key: propName,
              value,
              message,
            };

            throw error;
          }
        });
      });
    }
  }
}

export default Model;
