"use strict";
const { MongoClient, ObjectId } = require("mongodb");
const MONGO_URI ="mongodb+srv://jessicaseery:Jetskiseery13!@cluster0.ft8wtmq.mongodb.net/?retryWrites=true&w=majority";

const getDatabase = async () => {
    const client = await MongoClient.connect(MONGO_URI);
    return client.db("final-project");
};
const updateGame = async (id, updatedData, character) => {
    const db = await getDatabase();
    const gamesCollection = db.collection("games");
    try {
        console.log("Updating game with ID:", id);
        await gamesCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: updatedData},
        );
        console.log("Game updated successfully");
    } catch (error) {
        console.error("Error updating game in the database, fix the error and try again", error);
        throw error;
    }
};
const addCharacterToGame = async (req, res) => {
    const {id} = req.params;
    const newCharacter = req.body;
    try {
        const db = await getDatabase();
        const gamesCollection = db.collection("games");
        await gamesCollection.updateOne(
            {_id: new ObjectId(id) },
            {$push: {characters: newCharacter} }
        );
        res.json({message: "Character added to the game successfully"});
    } catch (error) {
        console.error("This is the error received when adding character to the game:", error);
        res.status(500).json({message: "Error adding character to the game"});
    }
};
const updateGameById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        await updateGame(id, updatedData);
        res.json({ message: "Game updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating game" });
    }
};
const getAllGames = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("final-project");
        const games = await db.collection("games").find({}).toArray();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching games" });
    } finally {
        client.close();
    }
};
const getGameById = async (req, res) => {
    const client = new MongoClient(MONGO_URI)
    try {
    await client.connect()
    const gameId = req.params.id;
    const db = client.db("final-project");
    const game = await db.collection("games").findOne({ _id: new ObjectId(gameId) });
    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ message: "Game not found" });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching game by ID", error: error.message });
} finally {
    client.close();
}
};
const addNewGame = async (req, res) => {
    const newGame = req.body;
    const db = await getDatabase();
    const gamesCollection = db.collection("games");
    try {
        const newGameId = new ObjectId();
        newGame._id = newGameId;
        await gamesCollection.insertOne(newGame);
        res.json({message: "Game added successfully! Congrats :)", gameId: newGameId});
    } catch (error) {
        res.status(500).json({message: "Error adding new game"});
    }
};
const addCommentToGame = async (req, res) => {
    const {id} = req.params;
    const {userId, username, text, recommended} = req.body;
    try {
    const db = await getDatabase();
    const gamesCollection = db.collection('games');
    const commentId = new ObjectId();
    await gamesCollection.updateOne(
        {_id: new ObjectId(id)},
        {$push: {
            comments: {
                _id: commentId,
                userId: new ObjectId(userId),
                username,
                text,
                recommended,
                },
            },
        }
    );
    res.json({message: 'Comment added successfully! Thanks for your contribution!', commentId: commentId});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error adding comment to the game'});
    }
};
const deleteCommentFromGame = async (req, res) => {
    const {id, commentId} = req.params;
    try {
        const db = await getDatabase();
        const gamesCollection = db.collection("games");
        await gamesCollection.updateOne(
            {_id: new ObjectId(id)},
            {$pull: {comments: {_id: new ObjectId(commentId)}}}
        );
        res.json({message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Cannot remove comment! Try again or contact IT", error);
        res.status(500).json({message: "Error deleting comment from the game"});
    }
};
const addFavoriteGame = async (req, res) => {
    const {id} = req.params;
    const {gameId} = req.body;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$setOnInsert: {favorites: [] }},
            {upsert: true}
        );
        await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$addToSet: {favorites: gameId}}
        );
        res.json({message: "Game added to favorites successfully :)"});
    } catch (error) {
        console.error("Couldn't add game to favorites", error);
        res.status(500).json({message: "Error adding game to favorites"});
    }
};
const getFavoriteGamesForUser = async (req, res) => {
    const {id} = req.params;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        if (user) {
            const favoriteGames = user.favorites || [];
            res.json(favoriteGames);
        } else {
            res.status(404).json({message: "User not found :( "});
        }
    } catch (error) {
        console.error("could not get the user's fav games", error);
        res.status(500).json({message: "Error getting the user's fav games"});
    }
};
const removeFavoriteGame = async (req, res) => {
    const {id, gameId} = req.params;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const result = await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$pull: {favorites: gameId}}
        );
        if (result.modifiedCount === 1) {
            res.json({message: "Game removed from favorites successfully!"});
        } else {
            res.status(404).json({message: "Game not found in favorites"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error removing game from favorites"});
    }
};
const deleteGameById = async (req, res) => {
    const {id} = req.params;
    try {
        const db = await getDatabase();
        const gamesCollection = db.collection('games');
        await gamesCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({message: 'Game deleted successfully :)'});
    } catch (error) {
        console.error('Wasnt able to delete the game',
        error);
        res.status(500).json({message: 'Error deleting game, try again'});
    }
};
const updateCharacterInGame = async (req, res) => {
    const {id, charactersid} = req.params;
    const updatedCharacterData = req.body;
    try {
        const db = await getDatabase();
        const gamesCollection = db.collection("games");
        await gamesCollection.updateOne(
            {_id: new ObjectId(id),
            "characters.id": charactersid},
            {$set: {"characters.$": updatedCharacterData}}
        );
        res.json({message: "Character is updated successfully :)"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error updating character in the game, change something and try again" 
        });
    }
};
const deleteCharacterFromGame = async (req, res) => {
    const {id, charactersid} = req.params;
    try {
        const db = await getDatabase();
        const gamesCollection = db.collection("games");
        await gamesCollection.updateOne(
            {_id: new ObjectId(id)},
            {$pull: {characters: {id: charactersid}}}
        );
        res.json({message: "Character deleted successfully! Ciao!"});
    } catch (error) {
        console.error("Error found when deleting character from the game:", error);
        res.status(500).json({ message: "Error deleting character from the game, try again" });
    }
};
const addToWishlist = async (req, res) => {
    const {id} = req.params;
    const {gameId} = req.body;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$setOnInsert: {wishlist: [] }},
            {upsert: true}
        );
        await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$addToSet: {wishlist: gameId}}
        );
        res.json({message: "Game added to wishlist successfully :)"});
    } catch (error) {
        console.error("Couldn't add game to wishlist", error);
        res.status(500).json({message: "Error adding game to wishlist"});
    }
};
const getUserWishlist = async (req, res) => {
    const {id} = req.params;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        if (user) {
            const userWishlist = user.wishlist || [];
            res.json(userWishlist);
        } else {
            res.status(404).json({message: "User not found :( "});
        }
    } catch (error) {
        console.error("could not get the user's wishlisted games", error);
        res.status(500).json({message: "Error getting the user's wishlisted games"});
    }
};
const removeFromWishlist = async (req, res) => {
    const {id, gameId} = req.params;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const result = await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$pull: {wishlist: gameId}}
        );
        if (result.modifiedCount === 1) {
            res.json({message: "Game removed from wishlist successfully!"});
        } else {
            res.status(404).json({message: "Game not found in wishlist"});
        }
    } catch (error) {
        console.error("Error removing game from wishlist :( ", error);
        res.status(500).json({message: "Error removing game from wishlist"});
    }
};

module.exports = {
    updateGameById,
    getAllGames,
    getGameById,
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
};