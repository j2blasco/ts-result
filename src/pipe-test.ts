import { pipe } from "./pipe";
import { asyncPipe } from "./pipe-async";
import { resultSuccess, Result, SuccessType, ErrorType } from "./result";

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

export function andThen<TSuccess, TError, TResult extends Result<any, any>>(
  callback: (value: TSuccess) => TResult
): (
  result: Result<TSuccess, TError>
) => Result<SuccessType<TResult>, TError | ErrorType<TResult>> {
  return (result) => result.andThen(callback);
}

export function andThenAsync<
  TSuccess,
  TError,
  TResult extends Result<any, any>
>(
  callback: (value: TSuccess) => Promise<TResult>
): (
  result: Result<TSuccess, TError>
) => Promise<Result<SuccessType<TResult>, TError | ErrorType<TResult>>> {
  return (result) => result.andThenAsync(callback);
}

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

// TODO:

// async function test3() {
//   var result = await pipe(
//     doSomething(),
//     andThenAsync(async (_e) => resultSuccess(new Date()))
//   );

//   var resultAsync = await asyncPipe(
//     result,
//     andThenAsync(async (r) => "hey"),
//     andThen((r) => r.toUpperCase())
//   );

//   // For the old ones we could have:
//   var resultAsync = await asyncPipe(
//     result,
//     andThenResultAsync(async (r) => resultSuccess("hey")),
//     andThenResult((r) => resultSuccess(r.toUpperCase()))
//   );

// }
