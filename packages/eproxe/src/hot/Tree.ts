import { Fn, Objects, Pipe, Tuples, Call, Unions, ComposeLeft, _, PartialApply, Apply } from 'hotscript';
import { unset } from 'hotscript/dist/internals/core/Core';
import { Primitive } from 'hotscript/dist/internals/helpers';

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

export interface UpdateDeep<TFunc extends Fn> extends Fn {
	return: Pipe<
		this['arg0'],
		[
			EntriesDeep,
			UpdateEntries<TFunc, this['arg0']>
		]
	>
}