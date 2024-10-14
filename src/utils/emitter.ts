import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event: string, fn: () => void) => eventEmitter.on(event, fn),
  once: (event: string, fn: () => void) => eventEmitter.once(event, fn),
  off: (event: string, fn: () => void) => eventEmitter.off(event, fn),
  emit: (event: string, payload?: () => void) => eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export default Emitter;
