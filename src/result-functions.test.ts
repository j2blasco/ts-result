// import { asyncPipe, pipe } from "@j2blasco/ts-pipe";
import { andThen, andThenAsync } from "./result-functions";
import { resultSuccess, resultError } from "./result";
import { assertType } from "./utils/test/assert-type";

function doSomething() {
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
    const transformed = await andThenAsync(async (x: number) => resultSuccess(x * 2))(result);
    expect(transformed.unwrapOrThrow()).toBe(10);
  });

  test("andThenAsync preserves failures", async () => {
    const result = resultError.unknown("error message");
    const transformed = await andThenAsync(async (x: any) => resultSuccess(x * 2))(result);
    
    // Check if the transformation preserves the error by trying to unwrap
    expect(() => transformed.unwrapOrThrow()).toThrow();
  });
});

// TODO: Re-enable these tests once ES module issues are resolved
/*
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
});
*/
