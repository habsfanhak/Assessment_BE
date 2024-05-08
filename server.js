const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userOps = require("./userOps.js")

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())

app.post("/tasks", async (req, res) => {
    try {
        const taskId = await userOps.returnTaskId()
        const msg = await userOps.createTask(taskId, req.body)

        res.json({ message: "Successfully processed task." });
    }
    catch (err) {
        console.error("Error processing task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get("/tasks", (req, res) => {
    userOps.getTasks()
    .then(tasks => {
        res.json(tasks)
    })
    .catch(err => {
        console.log("Error getting tasks:", err)
        res.status(500).json({ error: "Internal Server Error" });
    })
})

app.patch("/tasks", (req, res) => {
    userOps.editTask(req.body)
    .then(function(){
        res.json({message : "Successfully updated task."})
    })
    .catch(err => {
        console.log("Error updated task:", err)
        res.status(500).json({ error: "Internal Server Error" });
    })
})

app.delete("/tasks", (req, res) => {
    userOps.deleteTask(req.body)
    .then(function(){
        res.json({message : "Successfully deleted task."})
    })
    .catch(err => {
        console.log("Error updated task:", err)
        res.status(500).json({ error: "Internal Server Error" });
    })
})

userOps.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("Unable to start the server: " + err);
    process.exit();
})