const ex=require("express");
const app=ex();
const { MongoClient } = require("mongodb")
const url="mongodb://localhost:27017"
const nm=require("nodemailer")
const client=new MongoClient(url);
require("dotenv").config();
app.get("/bookintract",async(req,res)=>{
    var bookingCid=req.query.bookid;
    var lawyrid=req.query.lawyrid;
    var bookingCreason=req.query.bookreason;
    var bookingDateTime=req.query.bookdatetime;
    try{
        await client.connect();
        const dx=await client.db("court");
        const collection=await dx.collection("signup");
        const result=await collection.findOne({userid:bookingCid});
        var bookinggmail=result.email;
        const collect=await dx.collection("lawyer");
        const data=await collect.findOne({userid:lawyrid});
        var lawyergmail=data.email;
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
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:bookinggmail,
            subject:`intract With Lawyer${data.username}`,
            html:`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        flex-direction: column;
                    }
            
                    h1 {
                        color: #333;
                        font-size: 2em;
                        margin-bottom: 20px;
                    }
            
                    h2 {
                        color: #555;
                        font-size: 1.5em;
                        margin-bottom: 15px;
                    }
            
                    h3 {
                        color: #777;
                        font-size: 1.2em;
                        margin-bottom: 10px;
                    }
            
                    h4 {
                        color: #888;
                        font-size: 1em;
                    }
                </style>
            </head>
            <body>
                <h1>Successfully</h1>
                <h2>Intract with lawyer${data.username}</h2>
                <h3>so let's go to the payment section</h3>
                <h4>Thank you</h4>
            </body>
            </html>
            
            `,
        }
        const mailOptions2={
            from:process.env.EMAIL_USER,
            to:lawyergmail,
            subject:`intract With Client${result.username}`,
            html:`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        flex-direction: column;
                    }
            
                    h1 {
                        color: #333;
                        font-size: 2em;
                        margin-bottom: 20px;
                    }
            
                    h2 {
                        color: #555;
                        font-size: 1.5em;
                        margin-bottom: 15px;
                    }
            
                    h3 {
                        color: #777;
                        font-size: 1.2em;
                        margin-bottom: 10px;
                    }
            
                    h4 {
                        color: #888;
                        font-size: 1em;
                    }
                </style>
            </head>
            <body>
                <h1>Successfully</h1>
                <h2>Intract with Client${result.username}</h2>
                <h3>so we discuss before</h3>
                <h4>Thank you</h4>
            </body>
            </html>
            
            `,
        }
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptions2);
        const updata=await collect.updateOne({userid:lawyrid},{$set:{bookingCid:bookingCid,
            bookingCreason:bookingCreason,
            bookingDateTime:bookingDateTime,
            bookinggmail:bookinggmail,
        }})
        if(updata.modifiedCount===1){
            res.send(
                `
                    <html>
                        <script>
                            alert('intracted');
                            window.location.href='http://localhost:3000/${btoa("mainclient")}?${btoa("userid")}=${btoa(bookingCid)}&tj=3&lawyerid=${btoa(data.userid)}'
                        </script>
                    <html>
                `
            )
        }
    }
    catch(err){
        res.send(err);
        console.error(err);
    }
    finally{
        await client.close();
    }
})
app.get("/booksuccess",async(req,res)=>{
    var lawyrid=req.query.lawyrid;
    var userTransactionId1=req.query.transid;
    try{
        await client.connect();
        const dy=await client.db("court");
        const collect=await dy.collection("lawyer");
        const dat=await collect.findOne({userid:lawyrid});
        const result2=await collect.updateOne({userid:lawyrid},{$set:{userTransactionId1:userTransactionId1}})
        if(result2.matchedCount===1){
            res.send(
                `
                    <html>
                        <script>
                            alert('updated');
                            window.location.href='http://localhost:3000/${btoa("mainclient")}?${btoa("userid")}=${btoa(dat.bookingCid)}&tj=1'
                        </script>
                    </html>
                `
            );
        }
    }
    catch(err){
        res.send(err);
    }
    finally{
        await client.close();
    }
})
app.get("/timeoutbook",async(req,res)=>{
    const cdate=new Date();
    var noww=cdate.toISOString().slice(0,16);
    try{
        await client.connect();
        const dx=client.db("court");
        const collect=await dx.collection("lawyer");
        
        var result=await collect.find({bookingCid:"mani_7_knights"}).toArray();
        var updata=null;
        for(var doc of result){
            if(doc.bookingDateTime===noww){
                var newdata={bookingCid:null,bookingCreason:null,bookingDateTime:null}
                updata=await collect.updateMany({bookingCid:"mani_7_knights"},{$set:{}});
            }
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