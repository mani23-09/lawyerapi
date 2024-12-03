const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
app.get("/updatelawyer",async(req,res)=>{
    var userid=req.query.userid;
    var password=req.query.password;
    try{
        await client.connect()
        const dx=client.db("court");
        const collect= dx.collection("lawyer");
        const result=await collect.updateOne({userid:userid},{$set:{password:password}}); 
        if(result.matchedCount===1){
            res.send(`
                <html>
                    <script>
                        alert('updatesuccess');
                        window.location.href='http://localhost:3000/${btoa("mainjudge")}';
                    </script>
                </html>
            `)
        }else{
            res.send(`
                <html>
                    <script>
                        alert('userid not match');
                        window.location.href='http://localhost:3000/${btoa("mainjudge")}';
                    </script>
                </html>
            `)
        }
    }
    catch(err){
        console.error(err);
    }
    finally{
        await client.close()
    }
})
app.get("/updatelawyer2Z", async (req, res) => {
    var q = req.query;
    try {
        await client.connect();
        const dx = await client.db("court");
        const collect = await dx.collection("lawyer");
        const result = await collect.updateOne({ userid: q.userid }, { $set: q });
        const findd = await collect.findOne({ userid: q.userid });
        if (result.matchedCount === 1) {
            res.send(`
                <html>
                    <script>
                        alert('Update success');
                        window.location.href='http://localhost:3000/${btoa("mainlawyer")}?lawyerid=${btoa(q.userid)}&tp=1&clientid=${btoa(findd.bookingCid)}';
                    </script>
                </html>
            `);
        } else {
            res.send(`
                <html>
                    <script>
                        alert('User ID not found');
                        window.location.href='http://localhost:3000/${btoa("mainlawyer")}?lawyerid=${btoa(q.userid)}&tp=1&clientid=${btoa(findd.bookingCid)}';
                    </script>
                </html>
            `);
        }
    } catch (err) {
        res.send(err);
    } finally {
        await client.close();
    }
});

app.get("/lawyerdel",async(req,res)=>{
    var userid=req.query.userid;
    userid=atob(userid);
    try{
        await client.connect()
        const dx=client.db("court");
        const collect= dx.collection("lawyer");
        const result=await collect.deleteOne({userid:userid}); 
        if(result.deletedCount===1){
            res.send(`
                <html>
                    <script>
                        alert('deletesuccess');
                        window.location.href='http://localhost:3000/${btoa("mainjudge")}';
                    </script>
                </html>
            `)
        }else{
            res.send(`
                <html>
                    <script>
                        alert('userid not match');
                        window.location.href='http://localhost:3000/${btoa("mainjudge")}';
                    </script>
                </html>
            `)
        }
    }
    catch(err){
        console.error(err);
    }
    finally{
        await client.close()
    }
})

module.exports = app;
