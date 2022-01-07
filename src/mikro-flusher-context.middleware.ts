import { Injectable, NestMiddleware } from "@nestjs/common";

import { MikroFlusherContext } from "./mikro-flusher-context.class";

/**
 * Apply {@link MikroFlusherContext} for the interceptor to work.
 */
@Injectable()
export class MikroFlusherContextMiddleware implements NestMiddleware {
  use(req: unknown, res: unknown, next: () => void): void {
    new MikroFlusherContext().apply(next);
  }
}
