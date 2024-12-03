const { MongoClient } = require("mongodb");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const url = "mongodb://localhost:27017";
const dbName = "court";
const collectionName = "signup";

const path = require("path");
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(cookieParser());

app.get("/profrnds", async (req, res) => {
    const cookdata = req.query.userId;
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({ userid: cookdata }, {
            projection: {
                _id: 0,
                userid: 1,
                username: 2,
                about: 6,
                Mobile: 7,
                email: 8,
                socialmedia: 9,
                imgname: 10,
                imgdata: 11,
                post_count: 14,
                followers: 15,
                connecting: 16
            }
        }).toArray();

        const headerRows = documents.map(doc => {
            return `<h1>
            <button onclick='window.location="/dispfrnds"' class="kk w3-btn">
                        <i class="fas fa-chevron-circle-left"></i>
                    </button>${doc.userid}</h1>`;
        });

        const Icon1Rows = documents.map(doc => {
            var xp = (doc.Mobile).toString();
            xp = "https://wa.me/" + xp;
            return `
                <button onclick="window.location='${xp}'" style="background: none;border: none;outline: none;color: green;height: 50%;width: 50%;font-size: 250%;margin-left: -20%;">
                    <i class="fab fa-whatsapp"></i>
                </button>
            `;
        });

        const Icon2Rows = documents.map(doc => {
            return ` ${doc.socialmedia}`;
        });

        const Icon3Rows = documents.map(doc => {
            return ` ${doc.email}`;
        });

        const tableRows = documents.map(doc => {
            return `
                <div class="mydiv fst">
                    <div style="text-align: center;"><img src="data:image/png;base64,${doc.imgdata.toString('base64')}" alt="${doc.imgname}" ></div>
                    <h3>&#128058 ${doc.username} &#129418</h3>
                </div>`;
        });

        const aboutRows = documents.map(doc => {
            const ai = doc.about.split(',');

            function generateHtml(ai) {
                let html = '';
                for (let i = 0; i < ai.length; i++) {
                    html += `<h4>${ai[i]}</h4>`;
                }
                return html;
            }

            return generateHtml(ai);
        });

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    body {
                        background: url('/images/backandro.png'); /* updated path */
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        height: auto;
                        color: white;
                    }

                    .w3-white {
                        height: 80vh;
                        width: 80vw;
                        border-radius: 6vh;
                        display: flex;
                        margin-bottom: 50px;
                    }

                    .mydiv {
                        background: none;
                        width: 100%;
                        height: 40%;
                    }

                    .fst {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }

                    img {
                        height: 50%;
                        width: 50%;
                        border-radius: 50%;
                    }

                    .kk {
                        background: none;
                        border: none;
                        border-radius: 50px;
                        outline: none;
                        font-size: 20px;
                    }

                    .kk:hover {
                        font-size: 35px;
                    }

                    p {
                        margin: 0% 10%;
                    }

                    button {
                        cursor: pointer;
                    }
                </style>
            </head>

            <link rel="stylesheet" href="/css/w3.css"> <!-- updated path -->
            <link rel="stylesheet" href="/css/fontawesome-free-6.5.1-web/css/all.min.css"> <!-- updated path -->

            <body class="fst">
                <h2 style="text-align: center;">
                    
                    ${headerRows.join('')}
                </h2>
                ${tableRows.join('')}
                <div class="w3-card w3-white fst">
                    <h4>Description</h4>
                    <p>${aboutRows.join('')}</p>
                    <br><br>
                    <div style="display: flex;">
                        ${Icon1Rows.join('')}
                        <button onclick="window.location='${Icon2Rows.join('')}'" style="background: none;border: none;outline: none;color: blue;height: 50%;width: 50%;font-size: 250%;margin-left: 20%;">
                            <i class="fab fa-linkedin"></i>
                        </button>
                        <button onclick="window.location='mailto:${Icon3Rows.join('')}'" style="background: none;border: none;outline: none;color:red;height: 50%;width: 50%;font-size: 250%;margin-left: 20%;">
                            <i class="far fa-envelope"></i>
                        </button>
                    </div>
                    <div style="display: flex;">
                        <button onclick="window.location='/dispfrnds'" style="background: none;border: none;outline: none;color: purple;height: 50%;width: 50%;font-size: 250%;margin-left: -20%;">
                            <i class="fas fa-user-friends "></i>
                        </button>
                        <button style="background: none;border: none;outline: none;color: rgb(0, 0, 0);height: 50%;width: 50%;font-size: 250%;margin-left: 20%;">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                        <button style="background: none;border: none;outline: none;color:cadetblue;height: 50%;width: 50%;font-size: 250%;margin-left: 20%;">
                            <i class="far fa-edit"></i>
                        </button>
                    </div>
                </div>
            </body>

            </html>
        `;

        res.send(htmlResponse);
    } catch (err) {
        console.error("CONSOLE ERROR", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Do not close the connection here; let the connection pool manage it
    }
});

app.get("/cread", (req, res) => {
    res.sendFile(__dirname + "/just.html");
});

module.exports = app;
