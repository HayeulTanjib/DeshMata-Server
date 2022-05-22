const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send("Hello From DeshMata Agronomic Tool & Manufacturing Inc.");
})

app.listen(port, () => {
    console.log('Listening on: ', port);
})













