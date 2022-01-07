import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { MikroFlusherInterceptor } from "./mikro-flusher.interceptor";
import { MikroFlusherContextMiddleware } from "./mikro-flusher-context.middleware";
@Module({
  imports: [MikroOrmModule.forFeature({})],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroFlusherInterceptor,
    },
  ],
})
export class MikroFlusherModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MikroFlusherContextMiddleware).forRoutes("*");
  }
}
