const ex = require('express');
const app = ex();
const url = "mongodb://localhost:27017";
const { MongoClient } = require("mongodb");
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbname = "court";

app.get('/crime', async (req, res) => {
    const tabname = "crime";
    const section = "IPC.SECTION:" + req.query.section;
    const secdef = req.query.secdef;
    const punish=req.query.punish;
    
    try {
        await client.connect();
        const db = await client.db(dbname);
        const collect = await db.collection(tabname);

        // Check if a document with the specified section already exists
        const existingDoc = await collect.findOne({ section: section });

        if (existingDoc) {
            const result = "Data is unique";
            res.status(200).json(result);
        } else {
            // Insert the new document
            const insertResult = await collect.insertOne({ section: section, sectiondefine: secdef,punishment:punish });
            res.status(200).json(insertResult);
        }
    } catch (err) {
        res.status(500).json(err);
    } finally {
        try {
            // Close the MongoDB client connection
            await client.close();
        } catch (closeErr) {
            console.error("Error closing MongoDB client connection:", closeErr);
        }
    }
});

module.exports = app;
