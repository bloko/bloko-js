import combineBlokos from './combineBlokos';
import combineModels from './combineModels';

function combine({ models, blokos }) {
  combineModels(models);
  combineBlokos(blokos);
}

export { combine };
export { default as http } from './http';
export { default as Model } from './Model';
export { default as getState } from './getters/getState';
export { default as getBloko } from './getters/getBloko';
