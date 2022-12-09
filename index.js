const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://car-care:me0jYQEDYOlASFKl@cluster0.twtll.mongodb.net/?retryWrites=true&w=majority`;
var uri = "mongodb://car-care:me0jYQEDYOlASFKl@ac-aszh8hu-shard-00-00.3kn3bwn.mongodb.net:27017,ac-aszh8hu-shard-00-01.3kn3bwn.mongodb.net:27017,ac-aszh8hu-shard-00-02.3kn3bwn.mongodb.net:27017/?ssl=true&replicaSet=atlas-yt8a18-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    // console.log('Hello');
    await client.connect()
    // console.log('connect')
    const serviceCollection = client.db('geniusCar').collection('services');
    const orderCollection = client.db('geniusCar').collection('orders');

    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });


    // orders api
    app.get('/orders', async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }

      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.patch('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status
      const query = { _id: ObjectId(id) }
      const updatedDoc = {
        $set: {
          status: status
        }
      }
      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })


  }
  finally {

  }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('genius car server is running')
})

app.listen(port, () => {
  console.log(`Genius Car server running on ${port}`);
})