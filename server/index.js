"use strict";
// import the needed node_modules.
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const {
    getGameById,
    updateGameById,
    getAllGames,
    addNewGame,
    signIn,
    signUp,
    getUserById,
    addCharacterToGame,
    addCommentToGame
} = require("./handlers");

const app = express();
    // Below are methods that are included in express(). We chain them for convenience.
    // --------------------------------------------------------------------------------
    app.use(morgan("dev"))
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
        next();
    });
    // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
    app.use(express.json())

    // Any requests for static files will go into the public folder
    app.use(express.static("public"))
    app.use(fileUpload());
    // Nothing to modify above or below this line
    // ---------------------------------
    app.get("/games", getAllGames)
    app.get("/games/:id", getGameById)
    app.patch("/games/:id", updateGameById)
    app.post("/games", addNewGame)
    app.post("/games/:id/characters", addCharacterToGame)
    app.post('/games/:id/comments', addCommentToGame);
    app.post("/signin", signIn)
    app.post("/signup", signUp)
    app.get("/users/:id", getUserById);
    // ---------------------------------
    // Nothing to modify above or below this line


    // this is our catch all endpoint.
    app.get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
        });
    })


    // Node spins up our server and sets it to listen on port 8000.
    app.listen(8000, () => console.log(`Listening on port 8000`));