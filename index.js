const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hyu0vhy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("backpack").collection("users");
    const destinationCollection = client.db("backpack").collection("destination");
    // const serviceCollection = client.db("backpack").collection("services");
    const blogCollection = client.db("backpack").collection("blogs");
    const userReviewCollection = client.db("backpack").collection("reviews");
    const paymentsCollection = client.db("backpack").collection("payments");

    // blog collection
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = await blogCollection.find(query).toArray();
      res.send(cursor);
    });
    // single blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { blogId: id };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });
    // review collection
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = await userReviewCollection.find(query).toArray();
      res.send(cursor);
    });
    // destination collection
    app.get("/destination", async(req, res) =>{
      const query = {};
      const cursor = await destinationCollection.find(query).toArray();
      res.send(cursor);
    });
    // single destination
    app.get("/destination/:id", async (req, res) => {
      const destinationId = req.params.id;
      const query = { id: destinationId };
      const result = await destinationCollection.findOne(query);
      res.send(result);
    });

    console.log(`mongodb is connected on port: ${port}`);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch((error) => console.error(error));

// testing server
app.get("/", (req, res) => {
  res.send(`server is running on ${port}`);
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
