import { asyncPipe, pipe } from "@j2blasco/ts-pipe";
import { andThen, andThenAsync } from "./result-functions";
import { resultSuccess } from "./result";
import { assertType } from "./utils/test/assert-type";

function doSomething() {
  return resultSuccess("5");
}

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
