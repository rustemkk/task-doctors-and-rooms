import * as request from 'supertest';

import app from '../index';
import db from './db.service';


class TestService {
  data: any = {};
  req;
  server;

  async init() {
    if (!this.server) {
      this.server = await app;
      this.req = request(this.server);
    }
  }

  close() {
    this.server.close();
  }

  delete(url: string): Promise<any> {
    return this.req
      .del(url)
      .set('Content-Type', 'application/json');
  }

  get(url: string): Promise<any> {
    return this.req
      .get(url)
      .set('Content-Type', 'application/json');
  }

  post(url: string, body: object): Promise<any> {
    return this.req
      .post(url)
      .send(JSON.stringify(body))
      .set('Content-Type', 'application/json');
  }

  put(url: string, body: object): Promise<any> {
    return this.req
      .put(url)
      .send(JSON.stringify(body))
      .set('Content-Type', 'application/json');
  }

  async destroyTables(tableNames) {
    for (let i = 0; i < tableNames.length; i++) {
      await db.define(tableNames[i], {}).destroy({ where: {} });
    }
  }
}

export default new TestService();