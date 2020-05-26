import createStore from './createStore';
import createUnit from './createUnit';
import * as globalState from './utils/globalState';

export default {
  create: createUnit,
  createStore,
};

export { globalState };
