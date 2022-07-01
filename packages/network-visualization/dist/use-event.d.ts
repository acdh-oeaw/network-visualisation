declare type Fn<TArgs extends Array<unknown>, TResult> = (...args: TArgs) => TResult;
/**
 * Should be replaced with upstream `useEvent` once that lands in `react`.
 *
 * @see https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export declare function useEvent<TArgs extends Array<unknown>, TResult>(handler: Fn<TArgs, TResult>): Fn<TArgs, TResult>;
export {};
