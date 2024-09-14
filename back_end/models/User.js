const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Task' 
    }]
});

module.exports = mongoose.model('User', userSchema);
