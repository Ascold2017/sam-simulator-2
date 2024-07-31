import type BaseLoop from './Loops/BaseLoop';
import FPSLoop from './Loops/FPSLoop';
import FixedLoop from './Loops/FixedLoop';

export default class LoopEngine {
	private loops: Map<string, BaseLoop> = new Map();
	public addFPSLoop(
		name: string,
		handler: (delta: number) => void,
		maxFPS?: number,
	) {
		this.loops.set(name, new FPSLoop(name, handler, maxFPS));
	}
	public addFixedLoop(
		name: string,
		handler: (delta: number) => void,
		interval: number,
	) {
		this.loops.set(name, new FixedLoop(name, handler, interval));
	}
	public removeLoop(name: string) {
		this.loops.get(name)?.interrupt();
		this.loops.delete(name);
	}

	public subscribeLoop(name: string, cb: () => void) {
		this.loops.get(name).addListener(cb)
	}

	public getLoops() {
		return Array.from(this.loops).map(([name, loop]) => loop)
	}

	public clearLoopsAll() {
		this.loops.forEach((l, name) => this.removeLoop(name))
	}
}
