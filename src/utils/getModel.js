import { models } from './state';

export function getModel(name) {
  const model = models.get(name);

  if (!model) {
    throw new Error(`Model ${name} cannot be found.`);
  }

  return model;
}

export default getModel;
