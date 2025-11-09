const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://socialDevelopmentServer:R2oQAWCPwqJecrY7@cluster0.hl8gbtt.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("social_work_db");
    const eventsCollection = db.collection("events");
    const joinedEventsCollection = db.collection("joinedEvents");

    app.get("/events", async (req, res) => {
      const result = await eventsCollection.find().toArray();
      res.send(result);
    });

    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;
      const result = await eventsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/events", async (req, res) => {
      const newEvent = req.body;
      const result = await eventsCollection.insertOne(newEvent);
      res.send(result);
    });

    app.put("/events/:id", async (req, res) => {
      const id = req.params.id;
      const updatedEvent = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updatedEvent.title,
          description: updatedEvent.description,
          eventType: updatedEvent.eventType,
          thumbnail: updatedEvent.thumbnail,
          location: updatedEvent.location,
          eventDate: updatedEvent.eventDate,
        },
      };
      const result = await eventsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/joinedEvents", async (req, res) => {
      const result = await joinedEventsCollection.find().toArray();
      res.send(result);
    });

    app.post("/joinedEvents", async (req, res) => {
      const joinedEvent = req.body;
      const result = await joinedEventsCollection.insertOne(joinedEvent);
      res.send(result);
    });

    console.log("MongoDB Pinged Successfully");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Social Development Events Server is Running...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
