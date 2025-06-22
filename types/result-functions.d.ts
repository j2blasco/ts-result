import { ErrorType, Result, SuccessType } from "./result";
export declare function andThen<TSuccess, TError, TResult extends Result<any, any>>(callback: (value: TSuccess) => TResult): (result: Result<TSuccess, TError>) => Result<SuccessType<TResult>, TError | ErrorType<TResult>>;
export declare function andThenAsync<TSuccess, TError, TResult extends Result<any, any>>(callback: (value: TSuccess) => Promise<TResult>): (result: Result<TSuccess, TError>) => Promise<Result<SuccessType<TResult>, TError | ErrorType<TResult>>>;
