const mongoose = require("mongoose")
const schema = mongoose.Schema

var task_schema = new schema({
   email:{
    type: String,
    required : true,
    unique: true
   },
   password:{
    type: String,
    required: true
   },
   name:{
    type: String,
    required: true
   },
   phone:{
    type: Number,
    required: true
   }
})

module.exports = mongoose.model("Users",task_schema);
