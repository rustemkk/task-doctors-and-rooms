'use strict';

import * as KoaCors from '@koa/cors';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import { oas as KoaOas } from 'koa-oas3';
import * as KoaRouter from 'koa-router';
import { each, reduce } from 'lodash';

import { routes as consultationsRoutes } from './consultations/consultations.controller';


export const init = async () => {
  const app: any = new Koa();
  app.use(KoaCors());
  let router = new KoaRouter({ prefix: '/api' });
  const routerVerbs = { post: router.post, get: router.get, put: router.put, delete: router.delete };
  const routes = [consultationsRoutes];
  each(routerVerbs, (func, verb) => {
    const allVerbRoutes = reduce(routes, (res, val) => ({ ...res, ...val[verb] }), {});
    each(allVerbRoutes, (middleware, path) => func.apply(router, [path, middleware]));
  });
  app
    .use(koaBody({ multipart: true }))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(KoaOas({ file: `${__dirname}/swagger.yml`, uiEndpoint: '/', endpoint: '/openapi.json' }));
  const server = app.listen(3000);
  console.log('Backend server initialized. Listening on port 3000.');

  return server;
};

export default init();