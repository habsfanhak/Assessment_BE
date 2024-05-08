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
    taskPriority: String,
    dateAdded: Date
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

module.exports.returnTaskId = function () {
    return new Promise(function (resolve, reject) {
        Task.find({})
        .sort({ "taskId": -1 })
        .limit(1)
        .exec()
        .then(data => {
          if (data && data.length > 0) {
            const lastRequestId = data[0]["taskId"];
            resolve(lastRequestId + 1);
          } else {
            resolve(1);
          }
        })
        .catch(err => {
          reject(`Unable to get the largest task id: ${err}`);
        });
    });
};

module.exports.createTask = function (taskId, data) {
    return new Promise(function(resolve, reject) {
        Task.create(
            { 'taskId': parseInt(taskId),
                "taskName": data.taskName,
                "taskDescription": data.taskDescription,
                "taskStatus": data.taskStatus,
                "taskPriority": data.taskPriority,
                "dateAdded": data.dateAdded
            }
          )
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject(`Unable to create task. Error: ${err}`);
            });
    })
}

module.exports.getTasks = function () {
    return new Promise(function (resolve, reject) {
        Task.find({})
            .exec()
            .then(data => {
                resolve(data)
            }).catch(err => {
                reject(`Unable to get tasks. Error: ${err}`);
            });
    });
}

module.exports.editTask = function (data) {
    return new Promise(function (resolve, reject) {
      Task.updateOne(
        { '_id': data._id },
        {
            "taskName": data.taskName,
            "taskDescription": data.taskDescription,
            "taskStatus": data.taskStatus,
            "taskPriority": data.taskPriority,
        }
      )
        .exec()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(`Unable to update task. Error: ${err}`);
        });
    });
  };

  module.exports.deleteTask = function(data) {
    return new Promise(function (resolve, reject) {
        Task.deleteOne({ '_id': data._id }
        ).exec()
        .then((data) => {
            resolve(data)
        })
        .catch(err => {
            reject(`Unable to delete task. Error: ${err}`);
        })
    })
}


