const express = require("express");
const app = express();
const ltcc = require("./lawtypecollectcreate");
const displaw = require("./displawacco");
const profile = require("./profile");
const signup = require("./signup");
const clientid = require("./clientid");
const login = require('./login');
const lawinsert = require("./law");
const lawupdate = require("./updatelaw");
const lawyerupdatedel = require("./updateDellawyer");
const lawjudge = require("./judgedisplaw");
const justlaw = require('./justfreud');
const crimelaw = require("./List");
const dispfrnds = require("./displayfrnds");
const profrnds = require("./profrnds");
const upclient = require("./updateclient");
const insertlawyer = require("./insertlawyer");
const book = require("./booking");
const followpost=require("./followpost")
app.use("/", ltcc);
app.use("/", book);
app.use("/", crimelaw);
app.use("/", displaw);
app.use("/", clientid);
app.use("/", followpost);
app.use("/", lawinsert);
app.use("/", insertlawyer);
app.use("/", lawupdate);
app.use("/", upclient);
app.use("/", lawyerupdatedel);
app.use("/", lawjudge);
app.use("/", justlaw);
app.use("/", dispfrnds);
app.use("/", profrnds);
app.use("/", profile);
app.use("/", signup);
app.use("/", login);

app.listen(8900);
