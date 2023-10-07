require('dotenv').config();

const express = require("express");
const moment = require("moment");

const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const DB_URL = process.env.DB_URL;

// Generate a UUID
function createID() {
    var dt = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt/16);
        return (c == "x" ? r :(r & 0x3 | 0x8 )).toString(16);
    });
    return uuid;
}

// Gets all Members
router.get("/", (req, res) => {

    /* THIS MODULE WORK! */

    MongoClient.connect(DB_URL, (err, db) => {
        if (err) throw err;
        var dbo = db.db(process.env.DB_NAME);
        dbo.collection(process.env.DB_COLLECT).find({}).toArray((err, result) => {
          if (err) throw err;
          db.close();
          res.status(200).json(result);
        });
    });

});

// Get only one Member
router.get("/:id", (req, res) => {

    /* THIS MODULE WORK! */

    MongoClient.connect(DB_URL, (err, db) => {
        if (err) throw err;
        var dbo = db.db(process.env.DB_NAME);
        // Check if element exists on db by its id
        dbo.collection(process.env.DB_COLLECT).findOne({ _id: req.params.id }, (err, result) => {
          if (err) throw err;
          db.close();
          res.status(200).json({
            id: result._id,
            name: result.name,
            email: result.email
          });
        });
    });

});

// Create Member
router.post("/", (req, res) => {

    /* THIS MODULE WORK! */

    const newMember = {
        _id: createID(),
        name: req.body.name,
        email: req.body.email,
        join_date: moment().format(),
        status: "online"
    }

    if(!newMember.name || !newMember.email) {
        return res.status(400).json({
            msg: "Please fill all spots!"
        });
    }

    MongoClient.connect(DB_URL, (err, db) => {
        if (err) throw err;
        var dbo = db.db(process.env.DB_NAME);

        dbo.collection(process.env.DB_COLLECT).insertOne(newMember, (err, res) => {
          if (err) throw err;
          db.close();
        });
    }); 

    res.status(200).json(newMember); // Return new user
});

// Update Member
router.put("/:id", (req, res) => {

  var query;

    MongoClient.connect(DB_URL, (err, db) => {
        if (err) throw err;
        var dbo = db.db(process.env.DB_NAME);
        // Check if element exists on db by its id
        dbo.collection(process.env.DB_COLLECT).findOne({ _id: req.params.id }, (err, result) => {
          if (err) throw err;

          req.params.name = undefined ? (query = { email: result.email }) : req.params.name;
          req.params.email = undefined ? (query = { email: result.name }) : req.params.email;

          var update = {$set: { email: req.params.email } };

          dbo.collection(process.env.DB_COLLECT).updateOne(query, update, (err, res) => {
            if (err) throw err;
            res.status(200).json({
              id: result._id,
              name: result.name,
              email: result.email
            });
          });

          db.close();

        });
    });

});

// Delete Member
router.delete("/:id", (req, res) => {

    /* THIS MODULE WORK! */

    MongoClient.connect(DB_URL, (err, db) => {
        if (err) throw err;
        var dbo = db.db(process.env.DB_NAME);

        dbo.collection(process.env.DB_COLLECT).deleteOne({_id: req.params.id}, (err, obj) => {
          if (err) throw err;
          db.close();
          res.status(200).json({
            msg: `Member id ${req.params.id} deleted!`
          });
        });
    }); 
});

module.exports = router;