const { MongoClient } = require("mongodb");
const express = require("express");
const path = require('path');
const cookieParser = require("cookie-parser");

const url = "mongodb://localhost:27017";
const dbName = "court";
const collectionName = "signup";
const publicPath = path.join(__dirname, 'public');
const client = new MongoClient(url, { useUnifiedTopology: true });
const app = express();  // Initialize app here
app.use(cookieParser());

app.use(express.static(publicPath));

app.get("/dispfrnds", async (req, res) => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Extract the search query from the request
        const searchQuery = req.query.search;

        // Define the projection for the fields you want to retrieve
	 const query = searchQuery ? { userid: { $regex: searchQuery, $options: 'i' } } : {};
        const projection = {
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
        };

        // Construct the MongoDB query based on the search query

        // Fetch documents from the collection based on the query
        const documents = await collection.find(query, { projection }).toArray();

        // Generate the HTML response
        const tableRows = documents.map(doc => `
            <div class="but" onclick="openProfile(${doc.userid})" ><button class="w3-btn" title="&#128058 ${doc.userid} &#129418" onclick="openProfile('${doc.userid}')" > <img onclick="openProfile('${doc.userid}')" src="data:image/png;base64,${doc.imgdata.toString('base64')}" alt="${doc.imgname}"> </button>
            </div>
            `);

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="/css/w3.css">
                <link rel="stylesheet" href="css/fontawesome-free-6.5.1-web/css/all.min.css">
                <style>
                    .w3-btn {
                        outline: none;
                    }
                    .w3-white {
                        display: flex;
                        padding: 0px 5px 0px 5px;
                    }
                    .blank {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .inl {   
                        margin-top: 50px;
                        margin-bottom: 50px;
                        width: 80vw;
                    }
                    tr, td  {
                        border: none;
                        height: 10vh;
                    }
                    th
                    {
                        border: none;
                        width: 25vw;
                        padding: 5%;
                    }
                    .but{
                        height: 20%;
                        width: 20%;
                        margin: 2% 2% 2% 2%;
                        border-radius: 20%;
                        background: none;
                        outline: none;
                        border: none;
                    }
                    img{
                        height: 100%;
                        width: 100%;
                        border-radius: 100px;
                    }
                    table {
                        width: 100%;
                    }
                    .but>button{
                        width: auto;
                        border-radius: 100%;
                        border: none;
                        outline: none;
                        background: none;
                    }
                    #kk{
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                        width: 100%;
                    }
                </style>
            </head>
            <body class="w3-blue">
                <div class="w3-container w3-white">
                    <p style="width: 75%;"><input type="text" class="w3-input w3-animate-input w3-border" placeholder="search frnds" name="search" value="${searchQuery || ''}" style="outline: #ccc;width: 70%;"></p>
                    <p id="search" style="display: flex;justify-content: center;align-items: center;width: 25%;"></p>
                </div>
                <h1>Search Your Frnds</h1>
                <div class="blank w3-container">
                    <div class="inl w3-card w3-blue">
                        <center><table>
                        <div id="kk">
                            ${tableRows.join('')}
                        </div>
                            <!-- Repeat the structure for additional rows -->
                        </table></center>
                    </div>
                </div>
                <script>
                    function handleDevice() {
                        const search = document.getElementById("search");
                        
                        if (window.innerWidth > 700) {
                            search.innerHTML = "<button style='width: 70%;' onclick='searchFriends()' class='w3-btn w3-blue'>search</button>";
                        } else {
                            search.innerHTML = "<button style='width: 70%;' onclick='searchFriends()' class='w3-btn w3-blue'><i class='fas fa-search'></i></button>";
                        }
                    }
                    var hove=document.getElementsByTagName('img');
                    for(var i=0;i < hove.length;i++){
                        hove[i].classList.add('w3-hover-sepia')
                    }
                    window.addEventListener('load', handleDevice);
                    window.addEventListener('resize', handleDevice);
                    function openProfile(userid) {
                        const profileUrl = "/profrnds?userId=";
                        window.location = profileUrl+userid;
                        document.cookie = "link=userid";
                    }
                        function searchFriends() {
                            const searchInput = document.querySelector('input[name="search"]').value;
                            window.location = '/dispfrnds?search=' + encodeURIComponent(searchInput);
                        }
                </script>
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

module.exports = app;
