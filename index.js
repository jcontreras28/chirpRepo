const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const Chirps = require("./models/chirps");

const db = require('./db');
db.on('error', console.error.bind(console, 'MongoDB connection errtor'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index',async (req, res) => {
    const chrips = await Chirps.find({}).sort({createdAt: 'descending'}).exec((err, chirps) => {
        /*let upperCasedChirp = {}
        for (var chirp in chirps) {

        }*/
        res.render("chirps2.ejs", { chirps });
    })
    
});

app.post('/',async (req, res) => {
    const chirp = new Chirps({
        text: req.body.content,
        upvotes: 0
    });
    try {
        await chirp.save();
        res.redirect("/index");
    } catch (err) {
        res.redirect("/index");
    }
});

app.post('/upvote',async (req, res) => {
    console.log('req.body', req.body);
    try {
        const thechirp = await Chirps.find({_id: req.body});
        console.log('thechirp: ', thechirp);
        await Chirps.updateOne({_id: req.body.id}, {upvotes: thechirp.upvotes + 1});
        res.redirect("/index");
    } catch (err) {
        res.redirect("/index");
    }
});



app.listen(3000, () => console.log("Server Up and running"));