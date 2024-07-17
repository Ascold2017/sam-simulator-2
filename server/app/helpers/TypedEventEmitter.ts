import EventEmitter from "events";

export class TypedEventEmitter<Events> extends EventEmitter {
    // @ts-ignore
    emit<K extends keyof Events>(event: K, payload: Events[K]): boolean {
        return super.emit(event as string, payload);
    }
// @ts-ignore
    on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
        return super.on(event as string, listener);
    }
}
