const ex = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const nm=require('nodemailer')
require('dotenv').config();
const app = ex();
const ran=require("lodash")
app.use(cors())
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/judgedisplaw", async (req, res) => {
    var ty=req.query.tabname;
    try {
        await client.connect();
        const db = client.db("court");
        const collection = db.collection(ty);
        const result = await collection.find({}).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.get("/judgedellaw", async (req, res) => {
    var ty = req.query.tabname;
    let deldata=null;
    if(ty==="crime" || ty==="civil" || ty==="corporate"){
        var section = req.query.section; // Change pid to _id
        deldata={ ipc_section:section }
    }
    else{
        var section = req.query.section; // Change pid to _id
        var act = req.query.act; // Change pid to _id
        deldata={ section:section,act:act }
    }
    try {
        await client.connect();
        const db = client.db("court");
        const collection = db.collection(ty);
        const result = await collection.deleteOne(deldata); // Use _id here
        if(result.deletedCount===1){
            res.send(`
                <html>
                    <script>
                        alert('deletesuccess')
                        window.location='http://localhost:3000/${btoa('mainjudge')}'
                    </script>
                </html>
            `)
        }
        else{
            res.send(`
                <html>
                    <script>
                        alert('deleteunsuccess')
                        window.location='http://localhost:3000/${btoa('mainjudge')}'
                    </script>
                </html>
            `)
        }
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});
app.get("/signdatas", async (req, res) => {
    const userid = req.query.userid;
    const email = req.query.email;

    try {
        await client.connect();
        const dx = client.db("court");
        const collect = dx.collection("signup");
        const result = await collect.findOne({ userid: userid, email: email });

        if (result) {
            const otp = generateOTP(); // Function to generate OTP

            const transporter = nm.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Security Code',
                html: `
                    <html>
                        <head>
                            <style>
                                h3 {
                                    color: blue;
                                }
                                body {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    flex-direction: column;
                                }
                            </style>
                        </head>
                        <body>
                            <h2>Accessing Your Law Account</h2>
                            <h1>${otp}</h1>
                        </body>
                    </html>
                `
            };

            // Send email
            await transporter.sendMail(mailOptions);
            // Update OTP in the database
            const ud=await collect.updateOne({ userid: userid, email: email }, { $set: { otp: otp } });
            if(ud){
                res.redirect(`http://localhost:3000/forgot2?userid=${btoa(userid)}`)
            }
        } else {
            res.send(`
                <html>
                    <script>
                        alert('Enter correct email/userid');
                        window.location='http://localhost:3000/forgot';
                    </script>
                </html>
            `);
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send(err.message || 'Internal Server Error');
    } finally {
        await client.close();
    }
});

// Function to generate a random six-digit OTP
function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += ran.random(0,9);
    }
    return otp;
}
app.get("/checkotp", async (req, res) => {
    try {
        var digits = req.query.digits;
        var userid = req.query.userid;

        if (!digits || !userid) {
            return res.status(400).send("Missing parameters");
        }

        var otp = '';
        for (var i = 0; i < digits.length; i++) {
            otp += digits[i];
        }

        await client.connect();
        const dx = client.db("court");
        const collect = dx.collection("signup");

        const result = await collect.findOne({ userid: userid, otp: otp });
        if (result) {
            const encodedUserId = btoa(userid); // Base64 encoding
            res.redirect(`http://localhost:3000/changepassword?userid=${encodedUserId}`);
        }
         else {
            return res.send("User ID and OTP not found");
        }
    } catch (error) {
        console.error("Error occurred while checking OTP:", error);
        return res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});
app.get("/passchanged",async(req,res)=>{
    var userid=req.query.userid;
    var pass=req.query.newPassword;
    var confirmpass=req.query.confirmPassword;
    var data={userid:userid};
    try{
        await client.connect();
        const dx = client.db("court");
        const collect = dx.collection("signup");
        const result = await collect.findOne(data);

        if (result) {
            const updata = await collect.updateOne(data, {
                $set: {
                    password: pass,
                    CorrectPassword: confirmpass
                }
            });

            if (updata.modifiedCount > 0) {
                // Password updated successfully
                res.send(`
                    <html>
                        <script>
                            alert("${userid} - Password changed successfully");
                            window.location='http://localhost:3000';
                        </script>
                    </html>
                `);
            } else {
                // Password not updated
                res.send("Password not updated");
            }
        } else {
            // User not found
            res.send("User not found");
        }
    }
    catch(err){
        res.send(err);
    }
    finally{
        await client.close();
    }
})
module.exports=app;