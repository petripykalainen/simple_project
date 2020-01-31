# simple_project

Simple project showcase using React, Express, Postgres and Nginx in a docker container.

Backend uses json webtokens for authentication/authorization with short refresh times. Final implementation a work in progress with storing information to database.

## Instuctions

Make sure a .env file exists in server folder root with following fields:
```toml
DB_USERNAME = <database username>
DB_PASSWORD = <database password>
DB_NAME = <database name>
JWT_ACCESS_SECRET = <any string>
JWT_REFRESH_SECRET = <any string>
```
run `docker-compose up --build` at root folder.
Runs at port 80 on localhost.

## Todo: 

Frontend parts, more API routes, testing.
