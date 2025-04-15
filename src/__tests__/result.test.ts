import {
  resultSuccess,
  resultError,
  unwrapSuccessResult,
  Result,
  ErrorWithCode,
} from "../result";

function createResult<TSuccess, TError>(): Result<TSuccess, TError> {
  return resultSuccess("test") as object as Result<TSuccess, TError>;
}

describe("Result Monad", () => {
  test("resultSuccess should create a success result", () => {
    const success = resultSuccess("test");
    expect(unwrapSuccessResult(success)).toBe("test");
  });

  test("resultError.unknown should create an unknown error result", () => {
    const error = resultError.unknown("An error occurred");
    try {
      error.unwrapOrThrow();
    } catch (e) {
      expect(e).toMatchObject({
        code: "unknown",
        data: { message: "An error occurred" },
      });
    }
  });

  test("resultError.withCode should create a coded error result", () => {
    const error = resultError.withCode("test-code" as const, {
      detail: "Some details",
    });
    try {
      error.unwrapOrThrow();
    } catch (e) {
      expect(e).toMatchObject({
        code: "test-code" as const,
        data: { detail: "Some details" },
      });
    }
  });

  test("Result Monad success should be chainable with inferred types - string -> int", () => {
    const resultString = createResult<string, ErrorWithCode<"test">>();

    const resultInt = resultString.andThen((value) => {
      type ValueType = typeof value;
      type Expected = string;
      const assertType: ValueType extends Expected ? true : false = true;
      expect(assertType).toBe(true);
      return resultSuccess(42);
    });

    type Test = typeof resultInt;
    type Expected = Result<number, ErrorWithCode<"test">>;

    const assertType: Test extends Expected ? true : false = true;
    expect(assertType).toBe(true);
  });

  test("Result Monad success should be chainable with inferred types - obj -> obj", () => {
    const resultString = createResult<
      { test: string },
      ErrorWithCode<"test">
    >();

    const resultInt = resultString.andThen((value) => {
      type ValueType = typeof value;
      type Expected = { test: string };
      const assertType: ValueType extends Expected ? true : false = true;
      expect(assertType).toBe(true);
      return resultSuccess({ test2: "test" });
    });

    type Test = typeof resultInt;
    type Expected = Result<{ test2: string }, ErrorWithCode<"test">>;

    const assertType: Test extends Expected ? true : false = true;
    expect(assertType).toBe(true);
  });
});
