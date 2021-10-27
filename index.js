const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;



app.use(cors());
// Send Json data
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9z7i3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanics");
    const serviceCollection = database.collection("services");


    // POST API

    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result)
    });

    //FIND
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })

    //API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray()
      res.send(result);
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




///Local DATA

app.get('/', (req, res) => {
  res.send('Genious Car Mechanic Homepage')
});

app.listen(port, () => {
  console.log("Genious carMechanic run with", port);
})