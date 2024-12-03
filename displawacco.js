const { MongoClient } = require("mongodb");
const express = require("express");
const path = require("path");

const url = "mongodb://localhost:27017";
const dbname = "court";

const app = express();

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const client = new MongoClient(url, { useUnifiedTopology: true });

app.get("/displaw", async (req, res) => {
    const tab = req.query.tabname;
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbname);
        const collection = db.collection(tab);

        let tabrows = null;
        let documents=null;
        if (tab === "family" || tab==="entertainment" || tab == "military") {
         documents= await collection.find({}, { projection: { _id: 0, act: 1, section: 2, title: 3,description:4 } }).toArray();
            tabrows = documents.map(doc => {
                const descriptions = (doc.description || '').split('.');
                const descriptionHTML = descriptions.map(description => {
                    const lines = (description || '').split('\n').map(line => `<p>${line.trim()}</p>`).join('');
                    return lines;
                }).join('');
                return `<div class="w3-container ">
                            <button style="width:100%;flex-wrap: wrap; display: flex; white-space: nowrap;" class="w3-btn w3-block w3-black w3-left-align">${doc.title}?</button>
                            <div class="panel">
                                <h2>${doc.section}</h2>
                                <h3>${doc.act}</h3>
                                ${descriptionHTML}
                            </div>
                        </div>`;
            });
        }
        else if (tab === "employ") {
            documents= await collection.find({}, { projection: { _id: 0, act: 1, section: 2, title: 3,description:4,punishment:5 } }).toArray();
               tabrows = documents.map(doc => {
                   const descriptions = (doc.description || '').split('.');
                   const descriptionHTML = descriptions.map(description => {
                       const lines = (description || '').split('\n').map(line => `<p>${line.trim()}</p>`).join('');
                       return lines;
                   }).join('');
                   const punishments = (doc.punishment || '').split('.');
                   const punishmentHTML = punishments.map(punishment => {
                       const lines = (punishment || '').split('\n').map(line => `<p>${line.trim()}</p>`).join('');
                       return lines;
                   }).join('');
                   return `<div class="w3-container ">
                               <button style="width:100%;flex-wrap: wrap; display: flex; white-space: nowrap;" class="w3-btn w3-block w3-black w3-left-align">${doc.title}?</button>
                               <div class="panel">
                                   <h2>${doc.section}</h2>
                                   <h3>${doc.act}</h3>
                                    <b>DESCRIPTION</b>
                                   ${descriptionHTML}
                                   <b>PUNISHMENT</b>
                                   ${punishmentHTML}
                               </div>
                           </div>`;
               });
           }
           else if (tab === "realestate" || tab === "environment" || tab === "intellectualproperty" || tab==="tax" || tab==="internationallaw" || tab==="immigration" || tab==="bankruptcy" ) {
               documents= await collection.find({}, { projection: { _id: 0, act: 1, section: 2, title: 3,description:4,penalty:5 } }).toArray();
                  tabrows = documents.map(doc => {
                      const descriptions = (doc.description || '').split('.');
                      const descriptionHTML = descriptions.map(description => {
                          const lines = (description || '').split('\n').map(line => `<p>${line.trim()}</p>`).join('');
                          return lines;
                      }).join('');
                      const punishments = (doc.penalty || '').split('.');
                      const punishmentHTML = punishments.map(punishment => {
                          const lines = (punishment || '').split('\n').map(line => `<p>${line.trim()}</p>`).join('');
                          return lines;
                      }).join('');
                      return `<div class="w3-container ">
                                  <button style="width:100%;flex-wrap: wrap; display: flex; white-space: nowrap;" class="w3-btn w3-block w3-black w3-left-align">${doc.title}?</button>
                                  <div class="panel">
                                      <h2>${doc.section}</h2>
                                      <h3>${doc.act}</h3>
                                       <b>DESCRIPTION</b>
                                      ${descriptionHTML}
                                      <b>Penality</b>
                                      ${punishmentHTML}
                                  </div>
                              </div>`;
                  });
              }
         else {
            documents = await collection.find({}, { projection: { _id: 0, ipc_section: 1, offense: 2, punishment: 3 } }).toArray();
            tabrows = documents.map(doc => {
                const punishments = (doc.punishment || '').split('.');
                const punishmentHTML = punishments.map(punishment => {
                    const lines = (punishment || '').split('\n').map(line => `<p>${line.trim()}</p>`).join('');
                    return lines;
                }).join('');
                return `<div class="w3-container ">
                            <button style="width:100%;flex-wrap: wrap; display: flex; white-space: nowrap;" class="w3-btn w3-block w3-black w3-left-align">${doc.offense}?</button>
                            <div class="panel">
                                <h2>${doc.ipc_section}</h2>
                                ${punishmentHTML}
                            </div>
                        </div>`;
            });
        }
        
        const isMobile = req.headers['user-agent'].match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

        const htmlResponse = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Display Law</title>
                    <link rel="icon" type="image/x-icon" href="icons/1707573773059j04jo1h2.ico">
                    <link rel="stylesheet" href="/css/w3.css">
                    <link rel="stylesheet" href="css/fontawesome-free-6.5.1-web/css/all.min.css">
                    <style>
                        .active {
                            background-color: #ccc; 
                        }
                        
                        .panel {
                            padding: 0 18px;
                            display: none;
                            background-color: white;
                            overflow: hidden;
                        }
                        
                        body {
                            background: #4b4bd1;
                            padding: 10px;
                        }
                        
                        h1 {
                            color: white;
                            text-align: center;
                        }
                        
                        .w3-container {
                            margin-bottom: 10px;
                        }
                        
                        .w3-btn {
                            width: 100%;
                        }
                        
                        .panel h2 {
                            margin-top: 0;
                        }
                    </style>
                </head>
                <body>
                    <h1>What is Your Defense</h1>
                    <h3>${tab}Laws</h3>
                    ${tabrows.join('')}
                    <script>
                        var acc = document.getElementsByClassName("w3-btn");
                        var i;
                        for (i = 0; i < acc.length; i++) {
                            acc[i].addEventListener("click", function() {
                                this.classList.toggle("active");
                                var panel = this.nextElementSibling;
                                if (panel.style.display === "block") {
                                    panel.style.display = "none";
                                } else {
                                    panel.style.display = "block";
                                }
                            });
                        }
                    </script>
                </body>
            </html>
        `;

        res.header("Content-Type", "text/html");
        res.send(htmlResponse);
    } catch (err) {
        console.error("CONSOLE ERROR", err);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

module.exports = app;
