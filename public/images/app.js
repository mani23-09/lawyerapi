var ex=require("express");
var app=ex();
var ltcc=require("./lawtypecollectcreate");
var displaw=require("./displawacco");
var cooking=require("./cookieport");
var profile=require("./profile");
var signup = require("./signup");
var login=require('./login');
var dispfrnds=require("./displayfrnds")
var profrnds=require("./profrnds")
app.use("/",ltcc);
app.use("/",cooking);
app.use("/",displaw);
app.use("/",dispfrnds);
app.use("/",profrnds);
app.use("/",profile);
app.use("/",signup);
app.use("/",login);
app.listen(8900);