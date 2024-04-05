const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        default: new Date()
    },
    end_date: {
        type: String,
        
    },
    status: {
        type: Boolean,
        default: false,
    }
});
const Task = mongoose.model("Task",taskSchema);
module.exports = Task;