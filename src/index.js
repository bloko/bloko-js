import createStore from './createStore';
import createUnit from './createUnit';
import * as globalState from './utils/globalState';
import merge from './utils/merge';

export default {
  create: createUnit,
  createStore,
};

export { globalState, merge };
