const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to insert lawyer data
app.post('/insertlawyer', upload.single('image'), async (req, res) => {
    try {
        // Check if file was uploaded successfully
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Connect to the database
        await client.connect();
        const db = client.db("court");
        const collection = db.collection("lawyer");

        // Find the max userid in the database
        const maxUserIdResult = await collection.findOne({}, { sort: { userid: -1 } });
        let maxUserId = maxUserIdResult ? parseInt(maxUserIdResult.userid) : 0;

        // Generate the new userid
        const newUserId = (++maxUserId).toString().padStart(4, '0');
        const currentYear = new Date().getFullYear().toString();
        const userid = `${newUserId}/${currentYear}`;

        // Extract data from request
        var { password, username, lawtype, email, fees, upiId, mobile } = req.body;
        const imgdata = req.file.buffer;
        const imgname = req.file.originalname;
        mobile=parseInt(mobile);
        // Construct the insert data
        const insertdata = {
            userid: userid,
            password: password,
            username: username,
            imgdata: imgdata,
            email: email,
            upiId: upiId,
            mobile: mobile,
            fees: parseInt(fees),
            imgname: imgname,
            lawtype: lawtype,
            bookingCid: null,
            bookingCreason: null,
            bookinggmail: null,
            bookingDateTime: null,
            userTransactionId1: null,
            userTransactionId2: null,
            about: null,
            posts:null,
            connects:null,
        };

        // Check if lawyer already exists
        const existingLawyer = await collection.findOne({ mobile: mobile });
        if (existingLawyer) {
            return res.send(
                `<script>
                    alert('Lawyer already exists.');
                    window.location.href = 'http://localhost:3000/${btoa("mainjudge")}';
                </script>`
            );
        }

        // Insert the data into the database
        const result = await collection.insertOne(insertdata);

        // Send the response
        if (result) {
            return res.send(
                `<script>
                    alert('Insert success.');
                    window.location.href = 'http://localhost:3000/${btoa("mainjudge")}';
                </script>`
            );
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the database connection
        await client.close();
    }
});

// Route to retrieve lawyer data
app.get("/lawyerdatas", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("court");
        const collection = db.collection("lawyer");
        const result = await collection.find({}).toArray();
        if (result) {
            res.send(result)
        } else {
            res.send({ userid: "not founded" })
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});
app.get("/lawyerSdatas", async (req, res) => {
    var userid=req.query.lawyerid;
    try {
        await client.connect();
        const db = client.db("court");
        const collection = db.collection("lawyer");
        const result = await collection.findOne({userid:userid});
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {

        await client.close();
    }
});

module.exports=app;