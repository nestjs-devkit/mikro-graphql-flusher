import { Deconstructed } from "advanced-promises";
import { AsyncLocalStorage } from "async_hooks";

/**
 * Request-scoped info for the interceptor to work.
 */
export class MikroFlusherContext {
  static get current(): MikroFlusherContext | undefined {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<MikroFlusherContext>();

  /**
   * Count of all mutations in the current request.
   */
  mutationCountTotal = 0;

  /**
   * Count of mutations which is already handled and waiting for flushing.
   */
  mutationCountHandled = 0;

  flush = new Deconstructed();

  apply<T>(fn: () => T): T {
    return MikroFlusherContext.storage.run(this, fn);
  }
}
