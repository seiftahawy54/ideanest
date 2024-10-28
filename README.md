# Simple User Registration System

- This project about creating a demo project as an Event Organizer for online events.:

## Project Function Requirements

- `User Registration`
  - Sign Up
  - Login
  - Refresh Auth using Refresh Token
- `Event`
  - Create Event
  - List Event
  - Invite Member
  - Delete Event

## System Requirements (If not using Docker)
- `MongoDB` v7.0.5 >=
- `NodeJS` 18.19.1 >=

## Installation instructions

- Clone project : `git clone https://github.com/seiftahawy54/ideanest.git`
- Create `.env` file for environment variables : `touch .env`
- Add important variables before running the app:
    - `MONGO_URI` : The url directs to database (mongodb)
    - `JWT_SECRET` : The secret key for JWT
    - `PORT`: (Optional) The port of the app, default is 8080
- Install dependencies : `yarn install`
    - The app will be accessible at ``http://localhost:8080``
- Run the project in dev mode : `yarn start:dev`
