import createTransition from '../createTransition';
import identity from './identity';
import { cache } from './state';

function getTransition(transition) {
  let cached = cache.get(transition);

  if (!cached) {
    if (typeof transition === 'string') {
      cached = createTransition(transition);
    } else {
      transition.input = transition.input || identity;
      transition.output = transition.output || identity;

      cached = transition;
    }

    cache.set(transition, cached);
  }

  return cached;
}

export default getTransition;
