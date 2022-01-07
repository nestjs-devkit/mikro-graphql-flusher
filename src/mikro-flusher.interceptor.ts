import { EntityManager } from "@mikro-orm/core";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { concatMap, Observable } from "rxjs";

import { MikroFlusherContext } from "./mikro-flusher-context.class";

/**
 * Invoke `em.flush()` after all mutations have been handled.
 */
@Injectable()
export class MikroFlusherInterceptor implements NestInterceptor {
  constructor(private em: EntityManager) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const operation =
      GqlExecutionContext.create(executionContext).getInfo<GraphQLResolveInfo>()
        .operation.operation;

    if (operation != "mutation") return next.handle();

    const context = MikroFlusherContext.current;
    if (!context) throw new Error();

    context.mutationCountTotal++;

    return next.handle().pipe(
      concatMap(async (result) => {
        context.mutationCountHandled++;

        const flush =
          context.mutationCountHandled == context.mutationCountTotal
            ? this.em
                .flush()
                .then(() => context.flush.resolve())
                .catch((err: unknown) => context.flush.reject(err))
            : context.flush;

        await flush;

        return result;
      }),
    );
  }
}
