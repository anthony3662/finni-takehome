# Finni Take Home Assignment

A basic patient information management platform built as a interview process take home assessment. Patient privacy is king in healthcare and a key consideration in my product decisions.
I included features to make sure only the appropriate individuals can view certain data

### Key Features
* Sign in with Google
* Users can have access to multiple organizations
* User may have different permissions between organizations
* Two roles are available in the app, an admin 'doctor' role and a read only 'clerk' role
* Custom field information attached to patients can be specified as viewable by all or doctors only
* An unlimited number of addresses and custom fields can be attached to patients
* Filtering by last name, zip code, DOB, custom field
* Doctor users can add new users to the org (the new user will have access to the org next time they log in with Google, no acct setup needed)
* Full CRUD features for patients and org users

### Building
1. yarn in both client and server to install packages
2. In the server directory, create a .env file with MONGO_USERNAME and MONGO_PASSWORD. The DB is cloud hosted, no local install required.
3. In the client directory, "yarn build" to build the bundle
4. In the server directory, "yarn start" to compile TS and start the server
5. Go to localhost:3000