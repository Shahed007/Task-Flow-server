const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.77jbz4j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const taskFlowDB = client.db("taskFlowDB");
    const taskCollection = taskFlowDB.collection("taskCollection");

    app.post("/task", async (req, res) => {
      try {
        const task = req.body;
        console.log(task);
        const result = await taskCollection.insertOne(task);
        res.send(result);
      } catch (error) {
        res.status(200).send({ message: "internal server error" });
      }
    });

    app.get("/tasks", async (req, res) => {
      try {
        const email = req.query.email;
        console.log(email);
        const tasks = await taskCollection.find({ email: email }).toArray();
        res.send(tasks);
      } catch (error) {
        res.status(500).send({ message: "internal server error" });
      }
    });

    app.put("/task/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const status = req.body;
        const filter = { _id: new ObjectId(id) };

        const options = { upsert: true };

        const updateDoc = {
          $set: {
            ...status,
          },
        };

        const result = await taskCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "internal server error" });
      }
    });

    app.delete("/task/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "internal server error" });
      }
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("my Home Care Hub server is running");
});

app.listen(port, () => {
  console.log(`my server is running port ${port}`);
});
