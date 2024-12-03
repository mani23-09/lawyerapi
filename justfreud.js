const { MongoClient } = require("mongodb");
const express = require("express");
const path = require("path");
const url = "mongodb://localhost:27017";
const dbname = "court";
const tab = "crime";

const app = express();

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const client = new MongoClient(url, { useUnifiedTopology: true });

app.get("/justlaw", async (req, res) => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbname);
        const collection = db.collection(tab);

        const documents = await collection.find({}, { projection: { _id: 0, section: 1, lawdefine: 2 } }).toArray();

        // Convert documents to JSON before sending in the response
        const jsonData = JSON.stringify(documents);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonData);
    } catch (err) {
        console.error("CONSOLE ERROR", err);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

module.exports = app;
