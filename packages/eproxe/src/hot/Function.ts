import { Fn, Call, Identity } from "hotscript";

export interface Ternary<TPredicate extends Fn, TSuccess extends Fn, TFailure extends Fn> extends Fn {
	return: Call<TPredicate, this['arg0']> extends true ? Call<TSuccess, this['arg0']> : Call<TFailure, this['arg0']>;
}

export interface If<TPredicate extends Fn, TSuccess extends Fn> extends Ternary<TPredicate, TSuccess, Identity> { }

export interface Value<T> extends Fn {
	return: T
}

export type True = Value<true>
export type False = Value<false>