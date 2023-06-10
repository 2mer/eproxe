import { Call, Fn } from "hotscript"
import { ProxyBase } from "../DynamicProxy"
import { UpdateDeep, UpdateLeaves } from "./Tree"

export interface ExtendProxy<TExtender extends Fn> extends Fn {
	return: Call<TExtender, Omit<this['arg0'], keyof ProxyBase>> & ProxyBase
}

export interface ExtendLeaves<TExtender extends Fn> extends Fn {
	return: Call<
		ExtendProxy<
			UpdateLeaves<TExtender>
		>,
		this['arg0']
	>
}

export interface ExtendDeep<TExtender extends Fn> extends Fn {
	return: Call<
		ExtendProxy<
			UpdateDeep<TExtender>
		>,
		this['arg0']
	>
}