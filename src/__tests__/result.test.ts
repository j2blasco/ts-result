import { resultSuccess, resultError, unwrapSuccessResult } from '../result';

describe('Result Monad', () => {
  test('resultSuccess should create a success result', () => {
    const success = resultSuccess('test');
    expect(unwrapSuccessResult(success)).toBe('test');
  });

  test('resultError.unknown should create an unknown error result', () => {
    const error = resultError.unknown('An error occurred');
    expect(() => error.unwrapOrThrow()).toThrow('An error occurred');
  });

  test('resultError.withCode should create a coded error result', () => {
    const error = resultError.withCode('CODE_123', { detail: 'Some details' });
    expect(() => error.unwrapOrThrow()).toThrowErrorMatchingObject({
      code: 'CODE_123',
      data: { detail: 'Some details' },
    });
  });
});