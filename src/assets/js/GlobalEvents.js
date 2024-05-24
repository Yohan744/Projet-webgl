import mitt from 'mitt';

let emitter = mitt();

export function useGlobalEvents () {
    return {
        trigger: emitter.emit,
        on: emitter.on,
        off: emitter.off,
    };
}
