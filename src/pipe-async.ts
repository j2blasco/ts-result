/*
 * asyncPipe.ts
 *
 * A helper to compose a sequence of potentially asynchronous functions.
 * The initial input is a direct value.
 * Always returns a Promise for the final result.
 */

// Zero steps: wrap the value in a Promise
export function asyncPipe<T>(value: T): Promise<T>;

// One step
export function asyncPipe<A, B>(
  value: A,
  fn1: (input: A) => B | Promise<B>
): Promise<B>;

// Two steps
export function asyncPipe<A, B, C>(
  value: A,
  fn1: (input: A) => B | Promise<B>,
  fn2: (input: B) => C | Promise<C>
): Promise<C>;

// Three steps
export function asyncPipe<A, B, C, D>(
  value: A,
  fn1: (input: A) => B | Promise<B>,
  fn2: (input: B) => C | Promise<C>,
  fn3: (input: C) => D | Promise<D>
): Promise<D>;

// Four steps
export function asyncPipe<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => B | Promise<B>,
  fn2: (input: B) => C | Promise<C>,
  fn3: (input: C) => D | Promise<D>,
  fn4: (input: D) => E | Promise<E>
): Promise<E>;

// Fallback for more steps
export function asyncPipe(
  value: any,
  ...fns: Array<(arg: any) => any | Promise<any>>
): Promise<any> {
  // Seed the chain with a resolved promise of the initial value
  return fns.reduce(
    (accPromise, fn) =>
      (accPromise as Promise<any>).then(resolved => fn(resolved)),
    Promise.resolve(value)
  );
}

// Example usage:
// asyncPipe(
//   doSomething(),               // initial Result or any value
//   step1,                       // sync or async fn
//   asyncStep2,                  // returns Promise
//   step3                        // direct or Promise
// ).then(final => console.log(final));
