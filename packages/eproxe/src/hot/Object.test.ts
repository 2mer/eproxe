import { B, Call, Fn } from "hotscript";
import { UpdateDeep } from "./Object";
import { Equal, Expect } from "@type-challenges/utils";

test('Update deep', () => {
	type o = { a: 1, b: () => {}, c: { x: { y: { z: (f: 6) => 'nice' } } } };

	type tUse = (p: 'um') => 'hey';

	interface F1 extends Fn {
		return: this['arg0'] & { use: tUse }
	}
	interface F2 extends Fn {
		return: this['arg0'] & { f2: 'F2!' }
	}

	type ret = Call<UpdateDeep<F1>, o>

	type t1 = ret['a']['use']
	type t2 = ret['b']['use']
	type t3 = ret['c']['use']
	type t4 = ret['c']['x']['use']
	type t5 = ret['c']['x']['y']['use']
	type t6 = ret['c']['x']['y']['z']['use']
	type t7 = Parameters<ret['c']['x']['y']['z']>

	type ret2 = Call<UpdateDeep<F2, B.Extends<(...args: any) => any>>, o>
	// @ts-expect-error
	type ret2_t1 = ret2['a']['f2']
	type ret2_t2 = Expect<Equal<ret2['b']['f2'], 'F2!'>>
	type ret2_t3 = Expect<Equal<ret2['c']['x']['y']['z']['f2'], 'F2!'>>

	type ret3 = Call<UpdateDeep<F2, B.Extends<() => any>>, o>
	// @ts-expect-error
	type ret3_t1 = ret3['a']['f2']
	type ret3_t2 = Expect<Equal<ret3['b']['f2'], 'F2!'>>
	// @ts-expect-error
	type ret3_t3 = Expect<Equal<ret3['c']['x']['y']['z']['f2'], 'F2!'>>


})