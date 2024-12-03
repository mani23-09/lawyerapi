const express = require("express");
const { MongoClient } = require("mongodb");
const multer = require("multer");

const url = "mongodb://localhost:27017";
const tabname = "signup";
const client = new MongoClient(url);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/imageupclient", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send(`
                <html>
                    <script>
                        window.location=http://localhost:3000/bWFpbmNsaWVudA==?${btoa("userid")}=${btoa(userid)}&tj=1
                    </script>
                <html>
            `);
        }

        const imgdata = req.file.buffer;
        const userid = req.body.user;

        await client.connect();
        const db = client.db("court");
        const collection = db.collection(tabname);
        const result = await collection.updateOne({ userid: userid }, { $set: { imgdata: imgdata } });

        if(result.modifiedCount===1){
            res.redirect(`http://localhost:3000/bWFpbmNsaWVudA==?${btoa("userid")}=${btoa(userid)}&tj=1`)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

module.exports = app;
