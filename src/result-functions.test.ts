// import { asyncPipe, pipe } from "@j2blasco/ts-pipe";
import { andThen, andThenAsync, catchError, catchErrorAsync } from "./result-functions";
import { resultSuccess, resultError, ErrorUnknown, Result } from "./result";
import { assertType } from "./utils/test/assert-type";
import { asyncPipe, pipe } from "@j2blasco/ts-pipe";

function doSomething(): Result<string, ErrorUnknown> {
  return resultSuccess("5");
}

describe("Result functions", () => {
  test("andThen transforms success values", () => {
    const result = resultSuccess(5);
    const transformed = andThen((x: number) => resultSuccess(x * 2))(result);
    expect(transformed.unwrapOrThrow()).toBe(10);
  });

  test("andThen preserves failures", () => {
    const result = resultError.unknown("error message");
    const transformed = andThen((x: any) => resultSuccess(x * 2))(result);

    // Check if the transformation preserves the error by trying to unwrap
    expect(() => transformed.unwrapOrThrow()).toThrow();
  });

  test("andThenAsync transforms success values", async () => {
    const result = resultSuccess(5);
    const transformed = await andThenAsync(async (x: number) =>
      resultSuccess(x * 2)
    )(result);
    expect(transformed.unwrapOrThrow()).toBe(10);
  });

  test("andThenAsync preserves failures", async () => {
    const result = resultError.unknown("error message");
    const transformed = await andThenAsync(async (x: any) =>
      resultSuccess(x * 2)
    )(result);

    // Check if the transformation preserves the error by trying to unwrap
    expect(() => transformed.unwrapOrThrow()).toThrow();
  });

  test("catchError handles errors", () => {
    const result = resultError.unknown("error message");
    const recovered = catchError((error: ErrorUnknown) => 
      resultSuccess("recovered")
    )(result);
    expect(recovered.unwrapOrThrow()).toBe("recovered");
  });

  test("catchError preserves success values", () => {
    const result = resultSuccess(42);
    const recovered = catchError((error: any) => 
      resultSuccess("should not be called")
    )(result);
    expect(recovered.unwrapOrThrow()).toBe(42);
  });

  test("catchErrorAsync handles errors", async () => {
    const result = resultError.unknown("error message");
    const recovered = await catchErrorAsync(async (error: ErrorUnknown) => 
      resultSuccess("recovered async")
    )(result);
    expect(recovered.unwrapOrThrow()).toBe("recovered async");
  });

  test("catchErrorAsync preserves success values", async () => {
    const result = resultSuccess(42);
    const recovered = await catchErrorAsync(async (error: any) => 
      resultSuccess("should not be called")
    )(result);
    expect(recovered.unwrapOrThrow()).toBe(42);
  });
});

describe("Result integration with ts-pipe", () => {
  test("asyncPipe", async () => {
    var result = await asyncPipe(
      doSomething(),
      andThenAsync(async (_e) => resultSuccess(new Date())),
      andThen((r) => {
        assertType<typeof r, Date>(true);
        return resultSuccess("test");
      })
    );
    expect(result.unwrapOrThrow()).toBe("test");
  });

  test("pipe", async () => {
    var result = pipe(
      doSomething(),
      andThen((_e) => resultSuccess(new Date())),
      andThen((r) => {
        assertType<typeof r, Date>(true);
        return resultSuccess("test");
      })
    );
    expect(result.unwrapOrThrow()).toBe("test");
  });

  test("pipe", async () => {
    var result = pipe(
      doSomething(),
      andThen((_e) => resultSuccess(new Date())),
      andThen((r) => {
        assertType<typeof r, Date>(true);
        return resultSuccess("test");
      })
    );
    expect(result.unwrapOrThrow()).toBe("test");
  });
});
