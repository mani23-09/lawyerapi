const ex = require("express");
const app = ex();
const bp = require("body-parser");
const { MongoClient } = require("mongodb");

const url = 'mongodb://localhost:27017';
const dbname = "court";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bp.json());

app.get("/laws", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbname);
        const type = req.query.laws + "";

        if (type === "crime" || type === "civil" || type === "corporate") {
            const section = req.query.section;
            const offense = req.query.offense;
            const punishment = req.query.punishment;
            const insertdata = { ipc_section: section, offense: offense, punishment: punishment };

            const collection = db.collection(type);
            const data = await collection.findOne({ ipc_section: section });

            if (data) {
                return res.send(`<html><body><script>alert('${data.ipc_section} is already exists'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            } else {
                const result = await collection.insertOne(insertdata);
                return res.send(`<html><body><script>alert('${section} is inserted successfully'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            }
        } else if (type === "family" || type === "bankruptcy" || type === "entertainment" || type === "military") {
            const act = req.query.act;
            const section = req.query.section;
            const title = req.query.title;
            const description = req.query.description;
            const insertdata = { act: act, section: section, title: title, description: description };

            const collection = db.collection(type);
            const data = await collection.findOne({ act: act, section: section });

            if (data) {
                return res.send(`<html><body><script>alert('${data.section}&${data.act} already exists'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            } else {
                const result = await collection.insertOne(insertdata);
                return res.send(`<html><body><script>alert('${section}&${act} is inserted successfully'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            }
        }
         else if (type === "employ") {
            const act = req.query.act;
            const section = req.query.section;
            const title = req.query.title;
            const description = req.query.description;
            const punishment = req.query.punishment;
            const insertdata = { act: act, section: section, title: title, description: description, punishment: punishment };

            const collection = db.collection(type);
            const data = await collection.findOne({ act: act, section: section });

            if (data) {
                return res.send(`<html><body><script>alert('${data.section}&${data.act} already exists'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            } else {
                const result = await collection.insertOne(insertdata);
                return res.send(`<html><body><script>alert('${section}&${act} is inserted successfully'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            }
        } else {
            const act = req.query.act;
            const section = req.query.section;
            const title = req.query.title;
            const description = req.query.description;
            const penalty = req.query.penalty;
            const insertdata = { act: act, section: section, title: title, description: description, penalty: penalty };

            const collection = db.collection(type);
            const data = await collection.findOne({ act: act, section: section });

            if (data) {
                return res.send(`<html><body><script>alert('${data.section}&${data.act} already exists'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            } else {
                const result = await collection.insertOne(insertdata);
                return res.send(`<html><body><script>alert('${section}&${act} is inserted successfully'); window.location='http://localhost:3000/mainjudge';</script></body></html>`);
            }
        }
    } catch (err) {
        res.send(err);
    } finally {
        await client.close();
    }
});

module.exports = app;
