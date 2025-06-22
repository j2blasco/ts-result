export interface Result<TSuccess1, TError1> {
    andThen<TResult extends Result<any, any>>(f: (value: TSuccess1) => TResult): Result<SuccessType<TResult>, TError1 | ErrorType<TResult>>;
    andThenAsync<TResult extends Result<any, any>>(f: (value: TSuccess1) => Promise<TResult>): Promise<Result<SuccessType<TResult>, TError1 | ErrorType<TResult>>>;
    catchError<TResult extends Result<any, any>>(f: (error: TError1) => TResult): Result<TSuccess1 | SuccessType<TResult>, ErrorType<TResult>>;
    catchErrorAsync<TResult extends Result<any, any>>(f: (error: TError1) => Promise<TResult>): Promise<Result<TSuccess1 | SuccessType<TResult>, ErrorType<TResult>>>;
    unwrapOrThrow(errorCallback?: (e: TError1) => void): TSuccess1;
}
export declare function unwrapSuccessResult<T>(result: Result<T, never>): T;
export type ErrorWithCode<TCode, TData = object> = {
    code: TCode;
    data: TData;
};
export declare function errorWithCode<TCode, TData>(code: TCode, data: TData): ErrorWithCode<TCode, TData>;
export type ErrorUnknown = {
    code: 'unknown';
    data: {
        message: string;
    };
};
export declare function errorUnkown(message: string): ErrorUnknown;
export type SuccessType<T> = T extends Result<infer S, any> ? S : never;
export type ErrorType<T> = T extends Result<any, infer E> ? E : never;
export type SuccessVoid = never;
export declare function resultSuccessVoid(): Result<SuccessVoid, never>;
export declare function resultSuccess<TSuccess1>(value: TSuccess1): Result<TSuccess1, never>;
type EnforceLiteral<T> = string extends T ? never : T;
export declare class resultError {
    static unknown(message: string): Result<never, ErrorUnknown>;
    static withCode<TCode, TData = object>(code: EnforceLiteral<TCode>, data?: TData): Result<never, ErrorWithCode<TCode, TData>>;
    static fromError<TSuccess1, TError1 extends ErrorWithCode<any, object>>(error: TError1): Result<TSuccess1, TError1>;
}
export type UnwrapErrorFromResult<T> = T extends Result<any, infer U> ? U : never;
export declare function makeSafePromise<T>(promise: Promise<T>): Promise<Result<T, ErrorUnknown>>;
export {};
