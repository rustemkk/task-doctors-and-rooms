import { toNumber } from 'lodash';
import { Sequelize } from 'sequelize';

import db from '../utils/db.service';


export class BaseModel {
  static db: Sequelize = db;
  model;

  constructor(modelName: string, attributes) {
    this.model = db.define(modelName, attributes, { timestamps: false });
  }

  async findOne(where: object = {}): Promise<any> {
    return this.model.findOne({ where });
  }

  async findAll(where: object = {}, count: number = 50, offset: number = 0, order: any[] = []): Promise<any[]> {
    return this.model.findAll({
      where,
      limit: toNumber(count),
      offset: toNumber(offset),
      order,
    });
  }

  async update(id: number, data, options = {}): Promise<any[]> {
    await this.model.update(data, { where: { id }, ...options });
    const result = await this.findOne({ id });
    return result;
  }

  async delete(id: number): Promise<any[]> {
    return this.model.destroy({ where: { id } });
  }
}