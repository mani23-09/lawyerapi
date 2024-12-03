const { MongoClient } = require("mongodb");
const express = require("express");
const ejs = require("ejs");

const url = "mongodb://localhost:27017";
const dbName = "court";
const collectionName = "signup";

const client = new MongoClient(url, { useUnifiedTopology: true });

const app = express();

app.set("view engine", "ejs");
app.set("court", __dirname + "/some/court");

app.get("/dispfrnds", async (req, res) => {
    try {
        await client.connect();

        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({ /* Your query criteria */ }).toArray();

        const tableRows = documents.map(doc => {
            return `
            <div id="full">
                <div id="div1">
                    <img src="button1.gif" alt="">
                </div>
                <div id="div2">
                    <h1>${doc.userid}</h1>
                    <h2>${doc.username}</h2>
                </div>
                <div id="div3">
                    <button id="followBtn" onclick="toggleFollow()">Follow</button>
                    <button onclick="redirectToSignup()">Message</button>
                    <button id="connectBtn" onclick="toggleConnect()">Connect</button>
                </div>
            </div>`;
        });

        res.render("profile", { TABLE_ROWS: tableRows.join('') });
    } catch (err) {
        console.error("CONSOLE ERROR", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Do not close the connection here; let the connection pool manage it
    }
});

module.exports=app;

function toggleFollow() {
    // Toggle follow logic
    var followBtn = document.getElementById("followBtn");
    var isFollowed = followBtn.classList.contains('fc');

    if (isFollowed) {
        followBtn.classList.remove('fc');
        localStorage.removeItem('follow');
    } else {
        followBtn.classList.add('fc');
        localStorage.setItem('follow', 'fc');
    }
}

function redirectToSignup() {
    window.location = "signup.html";
}

function toggleConnect() {
    // Toggle connect logic
    var connectBtn = document.getElementById("connectBtn");
    var isConnect = connectBtn.classList.contains('fc');

    if (isConnect) {
        connectBtn.classList.remove('fc');
        localStorage.removeItem('connect');
    } else {
        connectBtn.classList.add('fc');
        localStorage.setItem('connect', 'fc');
    }
}
