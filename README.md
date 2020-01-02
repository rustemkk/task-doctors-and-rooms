# task-doctors-and-rooms

## Running tests & app

Install npm dependencies:
```
npm install
```
MySQL server should be installed and running locally (installation instructions below). 
Configuration of db is set in the ````./config/database.js```` file.

To run tests use:
```
npm run test:consultations
```
To run app use:
```
npm start
```
To run app in watch mode use:
```
npm run start:dev
```
Application will be available on ```http://localhost:3000/api```, Swagger API description will be available on ```http://localhost:3000```.

## Installing MySQL using Homebrew (macOS)

#### Homebrew:
```
// to install:
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

#### MySQL:

```
// to install
$ brew install mysql
$ sudo chown -R $(whoami) /usr/local/share/man/man8
$ chmod u+w /usr/local/share/man/man8

// to run
$ brew services start mysql

//to initialize MySQL user:
$ mysql -u root -p
mysql> CREATE DATABASE doctors_and_rooms
mysql> CREATE DATABASE doctors_and_rooms_test
mysql> CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// 'doctors_and_rooms', 'doctors_and_rooms_test', 'username', 'password' - should be same as in your ./config/database.js
mysql> GRANT ALL PRIVILEGES ON doctors_and_rooms.* TO 'username'@'localhost';
mysql> GRANT ALL PRIVILEGES ON doctors_and_rooms_test.* TO 'username'@'localhost';
```