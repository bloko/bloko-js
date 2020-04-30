import { blokos } from './state';

function getBloko(name) {
  const mod = blokos.get(name);

  if (!mod) {
    throw new Error(`Bloko ${name} cannot be found.`);
  }

  return mod;
}

export default getBloko;
