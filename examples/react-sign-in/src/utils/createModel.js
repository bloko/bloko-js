class Identity {
  constructor(props) {
    Object.keys(props).forEach(propName => {
      this[propName] = props[propName];
    });
  }
}

export const models = new Map();

models.set('_', Identity);

function createModel(modelName, model) {
  models.set(modelName, model);

  return model;
}

export function getModel(name) {
  const model = models.get(name);

  if (!model) {
    throw new Error(`Model ${name} cannot be found.`);
  }

  return model;
}

export default createModel;
