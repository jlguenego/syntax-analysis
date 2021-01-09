import assert from 'assert';

describe('Typescript Unit Test', () => {
  it('test attribute of', () => {
    class C {
      a = 'toto';
      b = 123;
    }

    function getProperty<T>(obj: T, str: keyof T): T[keyof T] {
      return obj[str];
    }

    const c = new C();
    const result = getProperty(c, 'b');
    assert.deepStrictEqual(result, 123);
  });
});
