import createRepository from '../createRepository';
import { cache } from './state';

function getRepository(repository, repositoryOptions) {
  let cached = cache.get(repository);

  if (!cached) {
    cached =
      typeof repository === 'string'
        ? createRepository(repository, repositoryOptions)
        : data => repository(data, repositoryOptions);

    cache.set(repository, cached);
  }

  return cached;
}

export default getRepository;
