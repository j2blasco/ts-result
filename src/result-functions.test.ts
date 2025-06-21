// import { pipe } from "@j2blasco/pipe"
import { resultSuccess } from "./result";

function doSomething() {
  return resultSuccess("5");
}

function doSomething2() {
  return resultSuccess("5");
}

var result = doSomething();

var resultPipeSimple = pipe(doSomething(), (test) =>
  test.andThen((t) => resultSuccess(5))
);

var resultPipePromise = pipe(
  doSomething(),
  (test) => test.andThenAsync(async (e) => resultSuccess(new Date())),
  async (test) => await test
);

var resultPipeSimple = pipe(
  doSomething(),
  andThen((t) => resultSuccess(5))
);

var resultPipe = pipe(
  doSomething(),
  andThenAsync(async (_e) => resultSuccess(new Date()))
);

async function test() {
  var resultPipe = await asyncPipe(
    doSomething(),
    andThenAsync(async (_e) => resultSuccess(new Date())),
    andThen((r) => resultSuccess("hey"))
  );
}

async function test2() {
  var result = await pipe(
    doSomething(),
    andThenAsync(async (_e) => resultSuccess(new Date()))
  );

  var resultAsync = await asyncPipe(
    result,
    andThenAsync(async (r) => resultSuccess("hey")),
    andThen((r) => resultSuccess(r.toUpperCase()))
  );
}