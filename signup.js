const express = require("express");
const app = express();
const multer = require("multer");
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const dbname = "court";
const mytab = "signup";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/signupht", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/signupclient", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.send("File not uploaded");
        }

        const user_id = req.body.id;
        const userna = req.body.na;
        const password = req.body.pw;
        const CorrectPassword = req.body.cw;

        if (password != CorrectPassword) {
            res.send(`
                <script>
                    alert('Password and Correct Password do not match. Do you want to create a new account?');
                    window.location='http://localhost:3000/signup';
                </script>
            `);
            return; // Return to prevent further execution
        }

        const place = req.body.place;
        const about = req.body.about;
        const mobile = req.body.mobile;
        const em = req.body.em;
        const socialmedia = req.body.sm;
        const imgname = req.file.originalname;
        const imgdata = req.file.buffer;

        // Output form data to the console for testing
        console.log("User ID:", user_id);
        console.log("Username:", userna);
        console.log("Password:", password);
        console.log("Correct Password:", CorrectPassword);
        console.log("Place:", place);
        console.log("About:", about);
        console.log("Mobile:", mobile);
        console.log("Email:", em);
        console.log("Social Media:", socialmedia);

        await client.connect();
        const db = client.db(dbname);
        const collect = db.collection(mytab);
        // Insert data into the collection
        const result = await collect.insertOne({
            userid: user_id,
            username: userna,
            password: password,
            CorrectPassword: CorrectPassword,
            place: place,
            about: about,
            Mobile: mobile,
            email: em,
            socialmedia: socialmedia,
            imgname: imgname,
            imgdata: imgdata,
            postimgs_name: null,
            postimgs_data: null,
            post_count: 0,
            followers: 0,
            connecting: 0,
            connecters:null,
            otp:null,
        });
        if(result){
            res.redirect('http://localhost:3000');
        }
        
    } catch (err) {
        // Check for duplicate key error (code 11000) indicating a violation of the unique index
        if (err.code === 11000) {
            res.status(400).send("Duplicate user ID or email");
        } else {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    } finally {
        await client.close();
    }
});
app.get("/followee", async (req, res) => {
  var q=req.query;
  var userid=q.userid;
  var user=q.user;
  var tf=q.truefalse==="true";
  try{
    await client.connect();
    const dx=client.db("court");
    const collect=dx.collection("signup");
    if(tf){
      res.send("its true")
    }
    else{
      const findata=await collect.findOne({userid:userid});
      var datx=findata.connecters
      var myd=null
      for(i=0;i<datx.length;i++){
        if(datx[i]['user']===user){
          myd=datx[i]
        }
      }
      if(myd['truefalse']){ 
        res.send()
      }
      else{
        res.send("false")
      }
    }
  }
  catch(err){
    console.error(err);
  }
  finally{
    await client.close();
  }
});
  
module.exports = app;
