const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
app.get("/followings", async (req, res) => {
    const { user, truefalse, userid } = req.query;
    const tf = truefalse === "true"; // Parse "truefalse" query parameter as boolean

    try {
        
        await client.connect();

        const db = client.db("court");
        const collection = db.collection("signup");
        const result1 = await collection.findOne({ userid });
        if (result1 && result1.connecters) {
            const resarr = result1.connecters;
            var arrd=[]
            for(i=0;i<resarr.length;i++){
                arrd.push(resarr[i]['user']);
            }
            var findornot=arrd.includes(user)
            var c=0
            if(findornot){
               for(i=0;i<resarr.length;i++){
                if(resarr[i]['user']===user){
                    if(resarr[i]['truefalse']===true){
                        resarr[i]['truefalse']=false;
                    }
                    else{
                        resarr[i]['truefalse']=true
                    }
                }
               }
            }
            else{
                resarr.push({user:user,truefalse:true});
            }
            var updata={$set:{connecters:resarr}};
            var result2=await collection.updateOne({userid:userid},updata);
            res.redirect(`http://localhost:3000/${btoa("mainclient")}?${btoa("userid")}=${btoa(userid)}&tj=1`)
        } else {
            res.send("k"); // Handle case when result1 or result1.connecters is not defined
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});
var multer=require("multer");
var storage=multer.memoryStorage();
var upload=multer({storage:storage});
app.post("/posts",upload.single("image") ,async(req,res)=>{
    var imgdata=req.file.buffer;
    var user=req.body.user
    try{
        await client.connect();
        const dx=await client.db("court");
        const collect=dx.collection("signup");
        var resarr=await collect.findOne({userid:user});
        resarr=resarr.postimgs_data
        var resarrlen=0;
        if(!resarr){
            resarr=[imgdata]
            resarrlen=1
        }
        else{
            resarr.push(imgdata)
            resarrlen=resarr.length;
        }
        const result1=await collect.updateOne({userid:user},{$set:{postimgs_data:resarr,post_count:resarrlen}})
        res.redirect(`http://localhost:3000/${btoa("mainclient")}?${btoa("userid")}=${btoa(user)}`)
    }
    catch(e){
        res.send(e);
        console.error(e);
    }
    finally{
        await client.close();
    }
})
module.exports = app;
