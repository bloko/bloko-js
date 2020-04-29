import combineBlokos from './combineBlokos';
import combineModels from './combineModels';
import Identity from './utils/Identity';
import * as state from './utils/state';

state.models.set('I', Identity);

function combine({ models, blokos }) {
  combineModels(models);
  combineBlokos(blokos);
}

export { combine };
export { default as http } from './utils/http';
export { default as Model } from './utils/Model';
export { default as getState } from './utils/getState';
export { default as getBloko } from './utils/getBloko';
