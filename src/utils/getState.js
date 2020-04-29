import { blokos } from './state';

function getState() {
  let state = {};

  Array.from(blokos.keys()).forEach(blokoName => {
    state[blokoName] = blokos.get(blokoName).state;
  });

  return state;
}

export default getState;
