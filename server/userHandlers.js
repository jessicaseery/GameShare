"use strict";
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const MONGO_URI ="mongodb+srv://jessicaseery:Jetskiseery13!@cluster0.ft8wtmq.mongodb.net/?retryWrites=true&w=majority";

const getDatabase = async () => {
    const client = await MongoClient.connect(MONGO_URI);
    return client.db("final-project");
};

let usersCollection;
const addUser = async (userData) => {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    await usersCollection.insertOne(userData);
};
const checkCredentials = async (username, password) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("final-project");
        usersCollection = db.collection('users');
        const user = await usersCollection.findOne({username});
        if (!user) {
            return false;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        return isValidPassword;
    } finally {
        client.close();
    }
};

const signIn = async (req, res) => {
    const {username, password} = req.body;
    const isValidCredentials = await checkCredentials(username, password);
    if (isValidCredentials) {
        if (!usersCollection) {
            return res.status(500).json({message: 'Internal server error'});
        }
        const user = await usersCollection.findOne({username});
        if (user) {
            const userId = user._id;
            res.json({message: 'User signed in successfully', userId});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
const signUp = async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    const newUserId = new ObjectId();
    const profilepic = req.files && req.files.profilepic ? req.files.profilepic : null;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            _id: newUserId,
            firstName,
            lastName,
            username,
            password: hashedPassword,
            profilepic,
        };
        await addUser(userData);
        res.json({ message: 'User signed up successfully', userId: newUserId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error signing up :( ' });
    }
};
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserByIdFromDatabase(id);
        if (user) {
            const { _id, firstName, lastName, username, profilepic, favorites } = user;
            const imagebase = profilepic
                ? profilepic.data.toString("base64")
                : null;

            res.json({
                _id,
                firstName,
                lastName,
                username,
                profilepic: { ...profilepic, data: imagebase },
                favorites,
            });
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error fetching user by ID", error: error.message});
    }
};
const deleteAccount = async (req, res) => {
    const {id} = req.params;
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const gamesCollection = db.collection('games');
        await usersCollection.deleteOne({ _id: new ObjectId(id)});
        await gamesCollection.updateMany(
            {"comments.userId": new ObjectId(id)},
            {$pull: {comments: {userId: new ObjectId(id)}}}
        );
        res.json({message: 'Account deleted successfully'});
    } catch (error) {
        console.error('Error deleting account, fix it and try again', error);
        res.status(500).json({message: 'Error deleting account'});
    }
};

const getUserByIdFromDatabase = async (userId) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("final-project");
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        return user;
    } finally {
        client.close();
    }
};

module.exports = {
    signIn,
    signUp,
    getUserById,
    deleteAccount
};