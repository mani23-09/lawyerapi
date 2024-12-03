var ex=require("express");
var app=ex();
const { MongoClient } = require("mongodb");
var url="mongodb://127.0.0.1:27017";
const client=new MongoClient(url,{useNewUrlParser:true,useUnifiedTopology:true});
var dbname="court";
app.get("/ltccreate",(req,res)=>{
    var tab=req.query.lt;
    async function connect(){
        try{
            await client.connect();
            console.log("mongodb is connected")
            const db=client.db(dbname);
            if(!(tab in(await db.listCollections().toArray()))){
                res.send("collection created");
            }
            else{
                console.log("have a collection");
            }
        }
        catch(err){
            console.error("Connection Error",err);
        }
        finally{
            await client.close();
        }
    }
    connect();
})
module.exports=app;