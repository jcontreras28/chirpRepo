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
        let upperCasedChirp = {}
        chirps.forEach (chirp => {
            chirp.text = chirp.text.toUpperCase();
        }) 
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
    try {
        const thechirp = await Chirps.find({_id: req.body.chirpId});
        const newUpvote = parseInt(thechirp[0].upvotes) + 1;
        await Chirps.findByIdAndUpdate(thechirp[0]._id, {upvotes: newUpvote});
        res.redirect("/index");
    } catch (err) {
        console.log('err: ', err);
        res.redirect("/index");
    }d
});

app.post('/downvote',async (req, res) => {
    try {
        const thechirp = await Chirps.find({_id: req.body.chirpId});
        const newUpvote = parseInt(thechirp[0].upvotes) - 1;
        await Chirps.findByIdAndUpdate(thechirp[0]._id, {upvotes: newUpvote});
        res.redirect("/index");
    } catch (err) {
        console.log('err: ', err);
        res.redirect("/index");
    }d
});



app.listen(3000, () => console.log("Server Up and running"));