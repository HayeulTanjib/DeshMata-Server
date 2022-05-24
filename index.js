const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
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
        const orderCollection = client.db('DeshMata').collection('orders');
        const userProfileCollection = client.db('DeshMata').collection('profiles');
        const reviewCollection = client.db('DeshMata').collection('reviews');

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

            //JWT token initialize
            const token = jwt.sign({ email: email }, process.env.JWT_TOKEN_SECRET, {expiresIn: '1d'})
            res.send({result, token});
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
     
        //Orders

        app.post('/order', async(req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result) 
        })

        app.get('/order/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/myorder/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        //User Profile
        app.put('/updateprofile/:email', async(req, res) => {
            const email = req.params.email;
            const updateProfile = req.body;
            const filter = {email: email};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    education: updateProfile.education,
                    location: updateProfile.location,
                    phone: updateProfile.phone,
                    linkedin: updateProfile.linkedin,
                },
            }
            const result = await userProfileCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/profileinfo/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const result = await userProfileCollection.findOne(query)
            res.send(result);
        })

        

        //Review
        app.post('/addreview', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/allreview', async(req, res) => {
            const query = {};
            const result = await reviewCollection.find(query).toArray();
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













