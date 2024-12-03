const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
var cors=require("cors");
app.use(cors());
app.get('/clientData', async (req, res) => {
   var clientid=req.query.userid;
   try{
        await client.connect();
        const dx=client.db("court");
        const collect=dx.collection("signup");
        const result=await collect.findOne({userid:clientid});
        res.send(result)
   }
   catch(err){
    res.send(err)
   }
   finally{
    await client.close()
   }
});

module.exports = app;
