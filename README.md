# Mikro GraphQL Flusher

GraphQL bulk-operation solution for MikroORM in Nest.

> This package internally uses `AsyncLocalStorage` to count mutations in requests, which may have [a slight negative impact on the performance](https://github.com/nodejs/node/issues/34493#issuecomment-845094849).

## Installation

```
npm i @nestjs-devkit/mikro-graphql-flusher
```

## Why?

The GraphQL runtime has built-in support for bulk-operations, which means you can send an array of GraphQL queries and mutations in a single HTTP request and receive an array of results.

While, in Nest, all bulk queries and mutations are handled in parallel. Therefore, when there are multiple mutations in a request, invoking `em.flush()` in resolvers will usually conflict and causes errors because `em.flush()` is not allowed to be invoked when another invoke is pending.

So how will we solve this problem? By importing the `MikroFlusherModule`, a global interceptor will be registered that will defer the return of each mutation after it has been handled. When all the mutations in the request have been deferred, the interceptor will invoke `em.flush()` to save the changes of all these mutations, and then return the results of all these mutations at once.

You can send bulk-operation requests to your GraphQL server now, and you don't need to invoke `em.flush()` manually any more! How wonderful!

## Tutorial

As said before, the only thing we need to do is to import the `MikroFlusherModule`:

```ts
@Module({
  imports: [
    MikroFlusherModule,
    // ...
  ],
})
export class AppModule {}
```

Done! (applies to Express only)

## Contributing

Pull requests are always welcome! ;]
