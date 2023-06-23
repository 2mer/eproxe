import { Fn, Objects, Pipe, Tuples, Call, Unions, ComposeLeft, _, PartialApply, Apply } from 'hotscript';
import { unset } from 'hotscript/dist/internals/core/Core';
import { Primitive } from 'hotscript/dist/internals/helpers';
import { If, True } from './Function';

export interface IsLeaf extends Fn {
	return: this['arg0'] extends Primitive ? (true) : (keyof this['arg0'] extends never ? true : false)
}

export type PathToEntry<path extends string | number | _ | unset = unset, obj = unset> = PartialApply<PathToEntryFn, [path, obj]>
export interface PathToEntryFn extends Fn {
	return: [
		this['arg0'],
		Call<
			Objects.Get<this['arg0']>,
			this['arg1']
		>
	]
}

export interface EntriesDeep extends Fn {
	return: Pipe<
		this['arg0'],
		[
			Objects.AllPaths,
			Unions.ToTuple,
			Tuples.Map<PathToEntry<_, this['arg0']>>,
		]
	>
}

export type Leaves = ComposeLeft<[
	EntriesDeep,
	Tuples.Filter<
		ComposeLeft<[
			Tuples.At<1>,
			IsLeaf
		]>
	>,
]>


export interface UpdateReducer extends Fn {
	return: Apply<Objects.Update<unset, unset, this['arg0']>, this['arg1']>
}

export interface MapEntryValue<TFunc extends Fn> extends Fn {
	return: this['arg0'] extends [infer TKey, infer TValue] ? [TKey, Call<TFunc, TValue>] : never;
	// return: this['arg0']
}

export interface UpdateEntries<TFunc extends Fn, TObj> extends Fn {
	return: Pipe<
		this['arg0'],
		[
			Tuples.Map<MapEntryValue<TFunc>>,
			Tuples.Reduce<UpdateReducer, TObj>
		]
	>
}

export interface UpdateLeaves<TFunc extends Fn> extends Fn {
	return: Pipe<
		this['arg0'],
		[
			Leaves,
			UpdateEntries<TFunc, this['arg0']>
		]
	>
}

type UpdateDeepValueDef<TFunc extends Fn, TValue> = {
	[key in keyof TValue]: Pipe<TValue[key], [UpdateDeep<TFunc>, TFunc]>
}

export interface UpdateDeep<TFunc extends Fn, TPredicate extends Fn = True> extends Fn {
	combinedFunc: If<TPredicate, TFunc>;

	return: (
		// value has no keys, apply func and exit recursion
		keyof this['arg0'] extends never ? (
			Call<this['combinedFunc'], this['arg0']>
		) : (
			// incase of function, we need to reapply the function signature to the mapped object
			this['arg0'] extends (...args: infer TArgs) => infer TRet ? (
				UpdateDeepValueDef<this['combinedFunc'], this['arg0']> & ((...args: TArgs) => TRet)
			) : (
				UpdateDeepValueDef<this['combinedFunc'], this['arg0']>
			)
		)
	)
}

export interface GetSymbol<T extends symbol> extends Fn {
	return: this['arg0'] extends { [key in T]: any } ? this['arg0'][T] : never
}