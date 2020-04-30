import getBloko from './getBloko';
import { blokos } from './state';

const blokoName = 'BlokoMock';
const blokoMock = {
  state: {},
  actions: {},
};

describe('getBloko', () => {
  it('should throw an error when bloko cannot be found', () => {
    function fn() {
      getBloko(blokoName);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"Bloko BlokoMock cannot be found."`
    );
  });

  it('should match correct bloko', () => {
    blokos.set(blokoName, blokoMock);

    const Bloko = getBloko(blokoName);

    expect(Bloko).toEqual(
      expect.objectContaining({
        state: expect.any(Object),
        actions: expect.any(Object),
      })
    );

    blokos.delete(blokoName);
  });
});
