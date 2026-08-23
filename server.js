const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.json({
        app:"Talabti",
        message:"طلبتي Backend Working"
    });
});

module.exports = app;
