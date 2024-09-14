const express = require("express");
const app = express()
const cors = require("cors");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/TaskTracker",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("MongoDB is Connected")
}) .catch(err => {
    console.error('MongoDB connection error:', err);
  });
  
app.post("/login",(req,res)=>{
    console.log(req.body)
    return res.json(req.body)
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});