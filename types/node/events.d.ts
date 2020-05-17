declare module "events" {
    interface EventEmitterOptions {
        /**
         * Enables automatic capturing of promise rejection.
         */
        captureRejections?: boolean;
    }

    interface NodeEventTarget {
        once(event: string | symbol, listener: (...args: any[]) => void): this;
    }

    interface DOMEventTarget {
        addEventListener(event: string, listener: (...args: any[]) => void, opts?: { once: boolean }): any;
    }

    namespace EventEmitter {
        function once(emitter: NodeEventTarget, event: string | symbol): Promise<any[]>;
        function once(emitter: DOMEventTarget, event: string): Promise<any[]>;
        function on(emitter: EventEmitter, event: string): AsyncIterableIterator<any>;
        const captureRejectionSymbol: unique symbol;

        /**
         * This symbol shall be used to install a listener for only monitoring `'error'`
         * events. Listeners installed using this symbol are called before the regular
         * `'error'` listeners are called.
         *
         * Installing a listener using this symbol does not change the behavior once an
         * `'error'` event is emitted, therefore the process will still crash if no
         * regular `'error'` listener is installed.
         */
        const errorMonitor: unique symbol;
        /**
         * Sets or gets the default captureRejection value for all emitters.
         */
        let captureRejections: boolean;

        type Events = Record<string | symbol, (...args: any[]) => void>;
        type Arguments<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [] ? [] : [T];
    
        interface EventEmitter<E extends Events = Events> extends NodeJS.EventEmitter<E> {}

        class EventEmitter {
            constructor(options?: EventEmitterOptions);
            /** @deprecated since v4.0.0 */
            static listenerCount(emitter: EventEmitter, event: string | symbol): number;
            static defaultMaxListeners: number;
            /**
             * This symbol shall be used to install a listener for only monitoring `'error'`
             * events. Listeners installed using this symbol are called before the regular
             * `'error'` listeners are called.
             *
             * Installing a listener using this symbol does not change the behavior once an
             * `'error'` event is emitted, therefore the process will still crash if no
             * regular `'error'` listener is installed.
             */
            static readonly errorMonitor: unique symbol;
        }
    }

    global {
        namespace NodeJS {
        
            interface EventEmitter<E extends EventEmitter.Events = Events> {
                addListener<K extends keyof E>(event: K, listener: E[K]): this;
                on<K extends keyof E>(event: K, listener: E[K]): this;
                once<K extends keyof E>(event: K, listener: E[K]): this;
                removeListener<K extends keyof E>(event: K, listener: E[K]): this;
                off<K extends keyof E>(event: K, listener: E[K]): this;
                removeAllListeners(event?: keyof E): this;
                setMaxListeners(maxListeners: number): this;
                getMaxListeners(): number;
                listeners<K extends keyof E>(event: K): Array<E[K]>;
                rawListeners<K extends keyof E>(event: K): Array<E[K]>;
                emit<K extends keyof E>(event: K, ...args: Arguments<E[K]>): boolean;
                listenerCount(event: keyof E): number;
                // Added in Node 6...
                prependListener<K extends keyof E>(event: K, listener: E[K]): this;
                prependOnceListener<K extends keyof E>(event: K, listener: E[K]): this;
                eventNames(): Array<keyof E>;
            }
        }
    }

    export = EventEmitter;
}
