"use strict";
const { MongoClient, ObjectId } = require("mongodb");
const MONGO_URI ="mongodb+srv://jessicaseery:Jetskiseery13!@cluster0.ft8wtmq.mongodb.net/?retryWrites=true&w=majority";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getDatabase = async () => {
    const client = await MongoClient.connect(MONGO_URI, options);
    return client.db("final-project");
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
    const client = new MongoClient(MONGO_URI)
    try {
    await client.connect();
    const db = client.db("final-project")
    const games = await db.collection("games").find({}).toArray();
    res.json(games);
    } catch (error) {
    res.status(500).json({ message: "Error fetching games" });
    }finally {
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
    console.error("Error fetching game by ID:", error);
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

        res.json({ message: "Game added successfully", gameId: newGameId });
    } catch (error) {
        res.status(500).json({ message: "Error adding new game" });
    }
};

module.exports = {
    updateGameById,
    getAllGames,
    getGameById,
    addNewGame,
};