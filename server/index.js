"use strict";
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");
const {
    getGameById,
    updateGameById,
    getAllGames,
    addNewGame,
    addCharacterToGame,
    addCommentToGame,
    addFavoriteGame,
    getFavoriteGamesForUser,
    deleteGameById,    
    updateCharacterInGame,
    deleteCharacterFromGame,
    deleteCommentFromGame,
    removeFavoriteGame,
    addToWishlist,
    getUserWishlist,
    removeFromWishlist
} = require("./handlers");

const {
    signIn,
    signUp,
    getUserById,
    deleteAccount,
} = require("./userHandlers");

const app = express();
    // Below are methods that are included in express(). We chain them for convenience.
    // --------------------------------------------------------------------------------
    app.use(morgan("dev"))
    app.use(cors());
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
    app.get("/users/:id", getUserById)

    app.post("/games", addNewGame) 
    app.patch("/games/:id", updateGameById)
    app.delete("/games/:id", deleteGameById)

    app.post("/games/:id/characters", addCharacterToGame)
    app.patch("/games/:id/characters/:charactersid", updateCharacterInGame)
    app.delete("/games/:id/characters/:charactersid", deleteCharacterFromGame)

    app.post('/games/:id/comments', addCommentToGame)
    app.delete("/games/:id/comments/:commentId", deleteCommentFromGame);

    app.post("/users/:id/favorites", addFavoriteGame)
    app.get('/users/:id/favorites', getFavoriteGamesForUser)
    app.delete("/users/:id/favorites/:gameId", removeFavoriteGame)

    app.post("/users/:id/wishlist", addToWishlist)
    app.get('/users/:id/wishlist', getUserWishlist)
    app.delete("/users/:id/wishlist/:gameId", removeFromWishlist)

    app.post("/signin", signIn)
    app.post("/signup", signUp)
    app.delete("/users/:id", deleteAccount);
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