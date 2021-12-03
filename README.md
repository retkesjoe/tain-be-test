# Backend side of the tain frontend test

## Tasks
- [ ] The tasks regarding the schedule table are unfinished.
- [x] The project is prepared for user registration.
- [x] The project is prepared for authentication.
- [x] Game presenter CRUD is done.
- [x] Postman collection added to the collections folder.

## Prerequisites
* Latest version of the [NodeJS](https://nodejs.org/en/download/current/) v14.5
* A running mysql server on your machine. I use mysql v8.0.20
* Working git for version control. I use git v2.25.1

## Project setup
* Copy the .env.example file and rename the copied version to .env
* Setup the .env with our local database details.
* Use tain as the MYSQL_DATEBASE value.
* `npm install`
* `npm run seed` 
* `npm run start`
* If the project doesn't work because another app or service use the port 9000 then put the PORT key into the .env file and add an unused port number.

The project should be running smoothly.