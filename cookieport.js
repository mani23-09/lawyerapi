const express = require("express");
const cookieParser = require("cookie-parser"); // Import cookie-parser middleware
const app = express();
// Use the cookie-parser middleware
app.use(cookieParser());

app.get("/cookie", (req, res) => {
    const cook = req.query.cook;
    if (!cook) {
        return res.status(400).send("Missing 'cook' parameter.");
    }

    const cookport = "http://" + cook + ":8900";
    res.cookie("cookport", cookport);
    var a=cookport;
    a=a+"/rest";
    res.send(`Cookie set successfully.<a href=${a}>BALABRO</a>`);
});

app.get("/portt", (req, res) => {
    let cookport = req.cookies.cookport;
    var a=cookport;
    a = a + "/rest";
    if (cookport) {
        res.send(`<a href=${a}>next</a>`);
    } else {
        res.status(400).send("Cookie not found.");
    }
});

app.get("/rest", (req, res) => {
    let cookport = req.cookies.cookport;
    var a=cookport.toString();
    a = a + "/bye";
    res.send(`<a href=${a}>MANIBRO</a>`);
});

app.get("/cookhtml", (req, res) => {
    res.sendFile(__dirname+"/cookieport.html")
});
app.get("/bye",(req,res)=>{
    let cookport = req.cookies.cookport;
    var a = cookport + "/cookhtml";
    res.send(`<a href=${a}>BALABRO</a>`);
})
module.exports = app;
