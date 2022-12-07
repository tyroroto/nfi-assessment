
# Project for NFI assessment test 

## Description

This project develop by using NestJS framework , MySQL for database and use yarn for package manager. 
- Auth method for API using JWT 
- Login method using Basic Auth Header 
## Installation

use yarn
```bash
$ yarn
```
- This project require setup .env file by follow .env.example and rename it .env
- create database for use in this project
- set your db name to DB_DATABASE in .env file
## Running the app

```bash
# development
$ yarn start:dev
```

After project is running up database will create table by default with Sequelize is set to auto synchronize for develoment purpose.  

## Test

for testing using Insomnia https://insomnia.rest/ by import api collection in folder api-json to insomnia application.
Can test with api order
- Register
- Login
- Deposit
- Withdraw
- UserBalance