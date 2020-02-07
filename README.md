# wvmongolab
Simple Mongo app to display movie data based on Atlas sample data.

Note: This app does not display proper connection handling for a NodeJS/MongoDB application. Currently initiates and closes a connection to Mongo for each HTTP call. This is due to laziness and a desire to keep this application simple. 

## Requirements
- nodejs
- npm

## Installation 
- clone this repo
- npm install

## Running The App
- edit .env file with your Atlas generated username, password, and connection string
- go to the root folder in the terminal and type `npm run start`
