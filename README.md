## These files are from another midterm repo: https://github.com/rickyforr/midterm ##

## THE LEARNING WALL ##

<img width="1276" alt="1registration" src="https://user-images.githubusercontent.com/22466500/26951066-1f765c76-4c5d-11e7-887d-4b13baabfc11.png">
<img width="1274" alt="2login" src="https://user-images.githubusercontent.com/22466500/26951070-22cdc9d6-4c5d-11e7-90c9-8ce0ca9c7054.png">
<img width="1260" alt="3index" src="https://user-images.githubusercontent.com/22466500/26951072-24a3ab2c-4c5d-11e7-9ae7-c5806da76e56.png">
<img width="1259" alt="4" src="https://user-images.githubusercontent.com/22466500/26951073-2605be06-4c5d-11e7-83e5-1da24dcecee8.png">

## Project Setup

1. Create your own empty repo on GitHub
2. Clone this repository (do not fork)
  - Suggestion: When cloning, specify a different folder name that is relevant to your project
3. Remove the git remote: `git remote rm origin`
4. Add a remote for your origin: `git remote add origin <your github repo URL>`
5. Push to the new origin: `git push -u origin master`
6. Verify that the skeleton code now shows up in your repo on GitHub

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above


## Creating, Migrating and Seeding the Initial Database ##

-Type the following command on your vagrant machine to connect to your postgres server:

psql -U vagrant -d template1

-Run the following SQL commands to create the necessary objects in the DB:

CREATE ROLE labber WITH LOGIN password 'labber';<br />
CREATE DATABASE midterm OWNER labber;

-Remember these, they will server as your DB connection credentials for your local
development database.

### To Fill all Tables
From terminal type:
knex migrate:latest

### To Seed all Tables
from terminal type:
knex seed:run


## DATABASE TABLES #
### USERS ###
id (PK), <br />
name, <br />
email, <br />
password<br />

### RESOURCES ###
id (PK), <br />
user_id (FK), <br />
resource_url, <br />
created_at, <br />
title, <br />
description, <br />
avg_rating, <br />
likes_count<br />

### RESOURCE TAGS ###
resource_id (PK, FK), <br />
tag_id (PK, FK)<br />

### TAGS ###
id (PK), <br />
tag_name<br />

### COMMENTS ###
id (PK), <br />
resource_id (FK),<br />
user_id (FK), <br />
c_text, <br />
created_at<br />

### RATINGS ###
user_id (PK), <br />
resource_id (PK), <br />
value<br />

### LIKES ###
user_id (PK), <br />
resource_id (PK)<br />

