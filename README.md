<p align="center">
  <a href="https://github.com/bandicootdev" target="blank"><img src="https://avatars.githubusercontent.com/u/42485564?s=96&v=4" width="200" alt="Nest Logo" /></a>
</p>

# Aluxion challenge

## Description

In this project, third-party APIs are used, such as unsplash, sending email with gmail through nodemailer and aws, specifically s3 and oauth with google and a database with mongodb


## Running the app with docker
run the api with docker in case you don't want to install anything locally
```bash
# running with docker
$ docker compose up dev

# running with docker and daemon
$ docker compose up dev -d
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
## Environment Variables
```
NODE_ENV=
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_HOST=
MONGO_DATABASE=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_PRIVATE_BUCKET_NAME=
UNSPLASH_ACCESS_KEY=
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Observations
* a file called .env.development must be created in the initial path of the project and the environment variables must be added
* documentation is at http://localhost:3000/docs#/
* please don't try the auth/google and auth/google/callback paths in the documentation, go to your browser and put:
  http://localhost:3000/auth/google
  the api will do the rest for you to have oauth authentication :)
* you can test everything from swagger except the above, remember that you must pass the token for almost all tests
* In case of any error, such as the api not running or any error, tell me so that they can try the whole test without any problem
## Support

for support write to my email thaymerapv@gmail.com.

## License

Nest is [MIT licensed](LICENSE).
