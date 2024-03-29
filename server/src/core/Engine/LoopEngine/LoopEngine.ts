import type BaseLoop from './Loops/BaseLoop.ts';
import FPSLoop from './Loops/FPSLoop.ts';
import FixedLoop from './Loops/FixedLoop.ts';

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
}
