import {
  resultSuccess,
  resultError,
  unwrapSuccessResult,
  Result,
  ErrorWithCode,
  resultSuccessVoid,
  SuccessVoid,
  ErrorUnknown,
} from "./result.js";
import { assertType, expectToCompile } from "./utils/test/assert-type.js";

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

  test("Type is properly infered in resultError.fromError (simple case)", () => {
    const result = createResult<
      SuccessVoid,
      ErrorWithCode<"error-code"> | ErrorUnknown
    >();
    const catchedResult = result.catchError((e) => {
      if (e.code === "error-code") {
        return resultSuccessVoid();
      }
      return resultError.fromError(e);
    });
    type Expected = Result<never, ErrorUnknown>;
    assertType<typeof catchedResult, Expected>(true);
  });

  test("Type is properly infered in resultError.fromError (complex case)", () => {
    const result = createResult<
      SuccessVoid,
      | ErrorWithCode<"error-code-1">
      | ErrorWithCode<"error-code-2">
      | ErrorUnknown
    >();
    const catchedResult = result.catchError((e) => {
      if (e.code === "error-code-1") {
        return resultSuccess(5);
      }
      return resultError.fromError(e);
    });
    type Expected = Result<number, ErrorUnknown | ErrorWithCode<'error-code-2'>>;
    assertType<typeof catchedResult, Expected>(true);
  });
});
