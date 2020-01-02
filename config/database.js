module.exports = {
  development: {
    username: '***',
    password: '***',
    database: 'doctors_and_rooms',
    host: 'localhost',
    dialect: 'mysql',
    seederStorage: 'sequelize',
    port: '3306'
  },
  test: {
    username: '***',
    password: '***',
    database: 'doctors_and_rooms_test',
    host: 'localhost',
    dialect: 'mysql',
    seederStorage: 'sequelize',
    port: '3306'
  },
};
