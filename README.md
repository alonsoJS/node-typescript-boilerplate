# Connect API

[![Status](https://github.com/HIMSS/hs-connect-api/workflows/Api%20CI/CD/badge.svg)](https://github.com/HIMSS/hs-connect-api/actions)

This is a Node.js REST API that acts as a middleware between the the ACCELERATE tenants (The professional network being a tenant) and it's dependent back-end services (such as Groups, Feed, Events, ...).

⚠️ Please refer to our [**root documentation**](https://github.com/himss/hs-root) for more documentation around our ecosystem.

## Getting Started

Install all npm dependencies:

```sh
npm install
```

## Environments

We use continuos integration and deployment to automatically test and deploy all code changes into master, to our development environment. Please refer to our [**root documentation**](https://github.com/himss/hs-root) for more documentation around our CI/CD pipeline.

| Env         | BASE URL                                                                     |
| ----------- | ---------------------------------------------------------------------------- |
| Development | [hs-connect-api-dev.herokuapp.com](https://hs-connect-api-dev.herokuapp.com) |
| Staging     | [hs-connect-api.herokuapp.com](https://hs-connect-api.herokuapp.com)         |

## Public API Documentation

This application exposes its API documentation using Swagger UI, which is bootstrapped via [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) and [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/). The documentation can be accessed at the [`/docs`](https://hs-connect-api.herokuapp.com/docs) path and sits behind basic authentication (ask your colleagues for credentials).

In order to add new endpoints, add the relevant tags (OpenAPI 3.0 compliant) to the jsdoc of the route. If you want to automatically convert a TypeScript interface into an OpenAPI compliant YAML file, you can refer to the following example:

```shell
npx ts-to-openapi --no-sort-props --no-as-comment -f <path-to-source-file> * > <path-to-output-file>
```

## Features

### Groups `/groups`

Groups are a collection of users which we store on our database. Groups have their own feed and events.

#### Access Levels

- **Public Access**: Group is visible for all users. Users can join with out invitation or approval to participate.
- **Private Access**: Group is visible for all users to see but user can not see discussions. Must request access.
- **Hidden Access**: Group is **not visible** to users. Users have to be invited to gain access. This level access could include private workgroups for public groups.

### Events `/events`

Events are a data entity nested within groups and can be created by a user. We provide basic CRUD endpoints.

### Notification Webhook `/notifications`

Notifications is a custom [getstream webhook](https://getstream.io/activity-feeds/docs/node/realtime_backend/#webhooks) for sending email notifications.

**How it works**
The webhook receives the activities being sent to the notification feed, parses them and sends emails to the receiving users acording to the received activity verb. Uses [`nodemailer`](https://www.npmjs.com/package/nodemailer) to send emails.

Static files regarding the email template and its assets where added to the project and (for now) are being copied into dist folder via the `build` command.

**Getstream dashboard configuration**

- Go to the [getstream dashboard](https://dashboard.getstream.io/dashboard/v2/organization/53910)
- Navigate to `Feed Group Configuration` page under the `Realtime Configuration` section
-

### Elastic Webhook `/elastic`

Elastic is a custom [getstream webhook](https://getstream.io/activity-feeds/docs/node/realtime_backend/#webhooks) that copies all GetStream `timeline` and `group` feed activities (posts) to an ElasticSearch index upon creation, to enable Search for posts.

**How it works**
The webhook receives all `timeline` and `group` feed updates (post creation and post deletion, GetStream currently does NOT communicate activity updates via their webhook yet).
It then indexes each new post activity as a separate document in ElasticSearch, and deletes posts from ES for which it has received a deletion update

### Search `/search`

This endpoint functions as our overall application search functionality. Currently, a user can search for events, groups, users and posts by specifying the entity type.

### Users `/users`

All users are stored within our application database. We provide user related CRUD functionality through these endpoints.

#### Test User Cleanup

Every now and then we should prune test users from production. There are some [test users for Cypress](https://github.com/HIMSS/hs-profnetwork-web/blob/develop/cypress/fixtures-prod/user.json) that should not get deleted. Here is some SQL to find users that are likely to be test accounts:

```sql
SELECT * from hs_db.user
WHERE type = 'Member' AND (
    email ~~* '%test%'
    OR email ~~* '%asd%'
    OR email ~~* '%qwe%'
    OR email ~~* '%fake%'
    OR email ~~* '%example%'
    OR email ~~* '%aaa%'
    OR email ~~* '%bbb%'
    OR name ~~* '%test%'
    OR name ~~* '%asd%'
    OR name ~~* '%qwe%'
    OR name ~~* '%fake%'
    OR name ~~* '%example%'
    OR name ~~* '%aaa%'
    OR name ~~* '%bbb%'
    OR name ~~* '%sss%'
    )
  /* keep Cypress test users */
  AND user_id != '5cf1f47d-3152-4d56-a9f8-017a26f19dfb'
  AND user_id != 'e602e8bd-b9c8-4411-9ec5-d3b08e5e2260'
  AND user_id != '3689d43a-5e80-4db4-baac-5bcebbf3d563'
  AND user_id != 'fafdce23-aa7c-4711-8658-f4f42430051d'
  /* keep very old test users (assume they stick around for a reason) */
  AND user_id != '7d8f8ac8-fda6-48e4-8554-ecb7cb9ab9b9' /* marie-test@testbase.de */
  AND user_id != 'aeb34f92-a324-4204-aa37-74308b0054a0' /* testcaseuser10@ciranet.net */
  /* keep false positives (matching email/name by coincidence) */
  AND user_id != '0d99e128-9717-44ee-8fe2-aea05d4c8ba1' /* asd in name */
  AND user_id != 'e997cbbd-91f5-4cd2-863e-a4ccb7ee71fa' /* aaa in email */
ORDER BY created_at ASC
```

Always check the rows for plausibility to avoid deleting false positives (real users). The SQL has already one of those users to be excluded. By chance he has 'asd' in his name. Keep this SQL up-to-date with future changes, especially the excludes.

Test users found should be deleted through the API endpoint `DELETE /users/:id` to ensure they get deleted both on Auth0 and in our DB. Use Postman or write a script (and provide it here 😉).

## Development

The codebase is written with [TypeScript](https://www.typescriptlang.org/), please get yourself familiar with it first.

### Commands

| Command        | Description                                         |
| :------------- | :-------------------------------------------------- |
| `npm run dev`  | Run development server                              |
| `npm run lint` | Lints the entire codebase with ESLint and Prettier  |
| `npm run test` | Runs all unit tests with [Jest](https://jestjs.io/) |

### Secrets

This app relies on remote services provided by Sentry, as such you will need to create an environment file with the appropriate variables for these services in order to run the app locally. Please do the following for:

- Create a `.env` file locally.
- Please get values for the DEV environment variables from your colleagues:

```txt
PORT=$replace-me
NODE_ENV=development

SENTRY_DSN=$replace-me
SENTRY_ENVIRONMENT=$replace-me

AUTH0_BASE_URL=$replace-me
AUTH0_CLIENT_ID=$replace-me
AUTH0_CLIENT_SECRET=$replace-me

PGPORT=$replace-me
PGSSLMODE=$replace-me

STREAM_API_KEY=$replace-me
STREAM_APP_SECRET=$replace-me

BASIC_AUTH_USER=$replace-me
BASIC_AUTH_PASSWORD=$replace-me

EMAIL_ADDRESS=$replace-me
EMAIL_PASSWORD=$replace-me

PERSONIFY_BASE_URL=$replace-me
PERSONIFY_USER_NAME=$replace-me
PERSONIFY_PASSWORD=$replace-me

FIXIE_URL=$replace-me

ELASTICSEARCH_HOST=$replace-me
ELASTICSEARCH_PORT=$replace-me
ELASTICSEARCH_USERNAME=$replace-me
ELASTICSEARCH_PASSWORD=$replace-me

LOADERIO_VERIFICATION_TOKEN=$replace-me
SUPPORT_EMAIL_ADDRESS=$replace-me

DATABASE_URL=$replace-me
DATABASE_MAX_CONNECTIONS=5
DATABASE_MIN_CONNECTIONS=0
```

## Database

We use a PostgreSQL database added as an Add-on on the respective Heroku app.

- Access the database via middleware by getting the values from the Heroku.
- You can also locally install the postgres and access via this middleware by installing docker and running.

```shell
source .env
docker run --name "$PGDATABASE" \
  -e POSTGRES_PASSWORD="$PGPASSWORD" \
  -e POSTGRES_USER="$PGUSER" \
  -e POSTGRES_DB="$PGDATABASE" \
  -p "$PGPORT":"$PGPORT" \
  -d postgres
```

- Update the database: connect the remote db via command prompt and can run the PL/SQL scripts.

```shell
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f db/migrations/00_initial.script.sql
```

## Application structure and flow

### Start-up summary

Startup file, as defined in `package.json`, is `src/index.ts`, which:

- Uses `sequelize` to

  - Authenticate db connection
  - Create schema (will create new tables for new models, but will not update tables for updated models)

- Calls `createApp()` in `src/app.ts`, which:

  - Creates Express app
  - Adds sentry handlers
  - Configures Swagger
  - Allows CORS for all requests
  - Adds `helmet` for securing Express
  - Adds JSON middleware for Express
  - Adds Express router from `src/api/index.ts`, which adds sub routers from each `router.ts` file from each folder in `src/api`. Each of these sub routers defines HTTP method routes relative to current folder using functions from relative `controller.ts` to handle those routes. These controller functions use sequelize models defined in relative `models.ts` for crud db operations, and SDKs to interact with external services like getstream and auth0.

- Initializes Sentry
- Starts cron job to periodically refresh Auth0 access token

### Notes on PostgreSQL interaction

- As stated above, sequelize will add tables to db for new models, but won’t update schema for update models. In this case, manual scripts must be run, which are tracked in `src/db/migrations`.
- There are files in `src/db/seeds`, but not sure if these are currently utilized to actually seed anything, looks like some are used in unit tests

### Tests

Each folder in `src/api/` has a \***\*test\*\*** folder in it that contains unit tests for corresponding controller.
