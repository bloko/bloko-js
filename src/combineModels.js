import { models } from './getters/state';

function combineModels(obj) {
  Object.keys(obj).forEach(modelName => {
    models.set(modelName, obj[modelName]);
  });
}

export default combineModels;
