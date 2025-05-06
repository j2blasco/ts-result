/*
 * pipe.ts
 *
 * A helper to compose a sequence of synchronous functions.
 * The initial input is a direct value.
 */

// Zero steps: return the value
export function pipe<A>(value: A): A;

// One step
export function pipe<A, B>(
  value: A,
  fn1: (input: A) => B
): B;

// Two steps
export function pipe<A, B, C>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C
): C;

// Three steps
export function pipe<A, B, C, D>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): D;

// Four steps
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): E;

// Fallback for more steps
export function pipe(
  value: any,
  ...fns: Array<(arg: any) => any>
): any {
  // Start with the provided value
  let acc = value;

  // Chain each synchronous function
  return fns.reduce((prev, fn) => fn(prev), acc);
}
