const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://backpack6470:J7FTBG8XivIcxt2K@cluster0.hyu0vhy.mongodb.net/?retryWrites=true&w=majority";

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
    const blogCollection = client.db("backpack").collection("blogs");
    const userReviewCollection = client.db("backpack").collection("reviews");
    const paymentsCollection = client.db("backpack").collection("payments");
    const discountCollection = client.db("backpack").collection("discount");
    const economicSeatCollection = client.db("backpack").collection("economicSeats");
    const businessSeatCollection = client.db("backpack").collection("businessSeats");

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
    app.get("/destination", async (req, res) => {
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
    // discount collection post
    app.post("/discount", async (req, res) => {
      const dicount = req.body;
      const result = await discountCollection.insertOne(dicount);
      res.send(result);
    });

    // discount collection get by email
    app.get("/discount", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = discountCollection.find(query);
      const discount = await cursor.toArray();
      res.send(discount);
    });
    // payment collection post
    app.post("/payment", async (req, res) => {
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);
      res.send(result);
    });
    // payment collection get query by email
    app.get("/payment", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = paymentsCollection.find(query);
      const payment = await cursor.toArray();
      res.send(payment);
    });
    // economicSeatCollection
    app.get("/economicSeatCollection", async (req, res) => {
      const query = {};
      const result = await economicSeatCollection.find(query).toArray();
      res.send(result);
    });
    // economicSeatCollection by id
    app.get("/economicSeatCollections", async (req, res) => {
      const busId = req.query.id;
      const query = { id: busId };
      const result = await economicSeatCollection.findOne(query);
      res.send(result);
    });

    // businessSeatCollection
    app.get("/businessSeatCollection", async (req, res) => {
      const query = {};
      const result = await businessSeatCollection.find(query).toArray();
      res.send(result);
    });
    // businessSeatCollection by id
    app.get("/businessSeatCollections", async (req, res) => {
      const busId = req.query.id;
      const query = { id: busId };
      const result = await businessSeatCollection.findOne(query);
      res.send(result);
    });
    // update discount offerTicketQuantity quantity
    app.put("/discount/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const discount = req.body;
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          offerTicketQuantity: discount.decreaseNumber,
        },
      };
      console.log(updatedDoc);
      const result = await discountCollection.updateOne(filter, updatedDoc, option);
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
