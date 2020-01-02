import { Sequelize } from 'sequelize';

import * as config from '../config/database';


const mysql = config[process.env.NODE_ENV || 'development'];

function init() {
  return new Sequelize(
    mysql.database,
    mysql.username,
    mysql.password,
    {
      host: mysql.host,
      dialect: 'mysql',
      port: mysql.port,
      logging: false,
      pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        freezeTableName: true,
      },
    }
  );
}

export default init();
