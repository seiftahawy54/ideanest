# Simple User Registration System

- This project about creating a demo project as a User Registration System:

## Project Function Requirements

- Create, and Search for a specific user with unique ID.
- Detect and locate user using their Longitude and Latitude.

## System Requirements
- `MariaDB` v11.0 >=
- `NodeJS` 18.19.1 >=

## Installation instructions

- Clone project : `git clone https://github.com/seiftahawy54/Simple-User-Registeration.git`
- Create `.env` file for environment variables : `touch .env`
- Add important variables before running the app:
    - `DATABASE_URL` : The url directs to database (MariaDB as mentioned above)
    - `MAPS_API_KEY` : Api Key for connecting to **open cage data** to use maps service
- Install dependencies : `yarn install`
    - The app will be accessible at ``http://localhost:3000/api``
- Run the project in dev mode : `yarn start:dev`
- API Documentation in Postman [Documentation Link](https://www.postman.com/winter-satellite-549347/workspace/simple-user-registration-system)
