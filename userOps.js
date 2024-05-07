const mongoose = require('mongoose');
let connectionString = process.env.MONGO_URL
let Schema = mongoose.Schema;

let taskSchema = new Schema({
    taskId: {
        type: Number,
        unique: true,
    },
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    taskPriority: String
    }, { collection: 'tasks' })

let Task;

module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        db = mongoose.createConnection(connectionString);

        db.on('error', err => {
            reject(err);
        });

        db.once('open', () => {
            console.log("Connection successful.")
            Task = db.model("tasks", taskSchema)
            resolve();
        });
    });
};

