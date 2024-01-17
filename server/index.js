"use strict";
// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const {
    getGameById,
    updateGameById,
    getAllGames,
    addNewGame,
} = require("./handlers");


express()
    // Below are methods that are included in express(). We chain them for convenience.
    // --------------------------------------------------------------------------------
    .use(morgan("dev"))

    // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
    .use(express.json())


    // Any requests for static files will go into the public folder
    .use(express.static("public"))
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    })
    // Nothing to modify above or below this line
    // ---------------------------------
    .get("/games", getAllGames)
    .get("/games/:id", getGameById)
    .patch("/games/:id", updateGameById)
    .post("/games", addNewGame)
    // ---------------------------------
    // Nothing to modify above or below this line


    // this is our catch all endpoint.
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
        });
    })


    // Node spins up our server and sets it to listen on port 8000.
    .listen(8000, () => console.log(`Listening on port 8000`));