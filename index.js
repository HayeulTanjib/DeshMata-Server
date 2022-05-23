const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.blvlf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async() => {

    try {

        await client.connect();
        const toolsCollection = client.db("DeshMata").collection("tools");
        const userCollection = client.db('DeshMata').collection("users");

        //User
        app.put('/user/:email', async(req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email : email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
              };
            const result  = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/tools', async(req, res) => {
            const query = {};
            const result = await toolsCollection.find(query).toArray();
            res.send(result);
        })

        //Purchase
        app.get('/purchase/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await toolsCollection.findOne(query);
            res.send(result);
        })
     

    }


    finally{
        //await client.close();
    }
}

run().catch(console.dir);
























//Initial Setup Check
app.get('/', (req, res) => {
    res.send("Hello From DeshMata Agronomic Tool & Manufacturing Inc.");
})
app.listen(port, () => {
    console.log('Listening on: ', port);
})













