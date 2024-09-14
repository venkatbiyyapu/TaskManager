const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        required: true
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }
});

module.exports = mongoose.model('Task', taskSchema);
