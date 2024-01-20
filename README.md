# GameShare
Concordia Bootcamp - Final Project
As a final project for my Concordia web developpment degree, I have chosen to create a website that would contain a large amount of video games along with images of the game, descriptions, information on the date of release and developpers, and much more! 

## Backend
- created handlers that would POST, GET, PATCH, and DELETE games, functions 100% through insomnia
- set up server and API endpoints for the games
- created Sign in and Sign up handlers that both POST. The sign up creates a new user and stores the information to mongo, and the Sign in verifies that the user input matches 100% with the information we have on our 
- set up API endpoints and handlers for users

## Frontend
- set up the App, Header, Home, and GameInfo components
- rendered all games through feth('/games') to be displayed on the Home page
- Added the font 'Khand' and animated slightly the company name in the top left (purple bar varies in color).
- cleared default styling through GlobalStyles
- created a GameInfo component set to render each game with the same layout, maintaining the same creative style for each game no matter the content.