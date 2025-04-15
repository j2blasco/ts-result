import {
  resultSuccess,
  resultError,
  unwrapSuccessResult,
  Result,
  ErrorWithCode,
  resultSuccessVoid,
} from "../result";
import { assertType, expectToCompile } from "../utils/test/assert-type";

function createResult<TSuccess, TError>(): Result<TSuccess, TError> {
  return resultSuccessVoid() as object as Result<TSuccess, TError>;
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
      type Expected = string;
      assertType<typeof value, Expected>(true);
      return resultSuccess(42);
    });

    type Expected = Result<number, ErrorWithCode<"test">>;
    assertType<typeof resultInt, Expected>(true);

    expectToCompile();
  });

  test("Result Monad success should be chainable with inferred types - obj -> obj", () => {
    const resultString = createResult<
      { test: string },
      ErrorWithCode<"test">
    >();

    const resultInt = resultString.andThen((value) => {
      type Expected = { test: string };
      assertType<typeof value, Expected>(true);
      return resultSuccess({ test2: "test" });
    });

    type Expected = Result<{ test2: string }, ErrorWithCode<"test">>;
    assertType<typeof resultInt, Expected>(true);

    expectToCompile();
  });
});
