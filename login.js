const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const dbName = "court";
const url = "mongodb://localhost:27017";

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/loginclient", async (req, res) => {
  const user_id = req.query.userid;
  const password = req.query.password;
  const role = req.query.role;

  let matchedUserId = null;

  async function connect() {
    try {
      await client.connect();
      const db = client.db(dbName);

      if (role === "Client") {
        const collect = db.collection("signup");
        const user = await collect.findOne({ userid: user_id, password: password }, { projection: { _id: 0, userid: 1 } });

        if (user) {
          const collect3 = db.collection("lawyer");
          const result3 = await collect3.find({}).toArray();

          for (const doc of result3) {
            const bookdate = new Date(doc.bookingDateTime);
            const diffDays = Math.floor((Date.now() - bookdate) / (1000 * 60 * 60 * 24));

            if (diffDays > 10) {
              const newdata = { bookingCid: null, bookingCreason: null, bookingDateTime: null };
              await collect3.updateOne({ _id: doc._id }, { $set: newdata });
            }
          }
          res.cookie('user_id', user.userid);
          const strlink = `http://localhost:3000/${btoa("splash")}?${btoa("userid")}=${btoa(user.userid)}`;
          res.redirect(strlink);
        } else {
          res.send("Sorry, no match found.");
        }
      } else if (role === "Judge") {
        const collect = db.collection("judge");
        const user = await collect.findOne({ userid: user_id, password: password }, { projection: { _id: 0, userid: 1 } });
        if (user) {
          res.cookie('user_id', user.userid);
          const strlink = `http://localhost:3000/${btoa("judgesplash")}`;
          res.redirect(strlink);
        } else {
          res.send("Sorry, no match found.");
        }
      } 
      else if(role === 'Lawyer'){
        const collect = db.collection("lawyer");
        const user = await collect.findOne({ userid: user_id, password: password });
        
        if (user) {
          if(user.bookingCid != null){
            var c=1
            res.cookie('user_id', user.userid);
            const strlink = `http://localhost:3000/${btoa("lawyersplash")}?lawyerid=${btoa(user_id)}&tp=1&clientid=${btoa(user.bookingCid)}`;
            res.redirect(strlink);
          }
          else{
            var c=0
            res.cookie('user_id', user.userid);
            const strlink = `http://localhost:3000/${btoa("lawyersplash")}?lawyerid=${btoa(user_id)}&tp=1&purge=${c}`;
            res.redirect(strlink);
          }
        } else {
          res.send("Sorry, no match found.");
        }
      }
      else {
        res.status(400).send("Invalid role specified.");
      }
    } catch (err) {
      console.error(err);
      if (err.code === 18) {
        res.status(401).send('Authentication Failed');
      } else {
        res.status(500).send(`Internal Server Error: ${err.message}`);
      }
    } finally {
      await client.close();
    }
  }

  connect();
});

module.exports = app;
