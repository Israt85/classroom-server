const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqq4klv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const userCollection = client.db('classroom').collection('users')
    const ClassRoomCollection = client.db('classroom').collection('class')

    app.get('/user',async(req,res)=>{
        const result= await userCollection.find().toArray()
        res.send(result)
    })
    app.post('/user',async(req,res)=>{
        const user= req.body;
        const result= await userCollection.insertOne(user)
        res.send(result)
    })
    app.delete('/user/:id',async(req,res)=>{
      const id = req.params.id
      const query ={_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
  })
    app.post('/class', async(req,res)=>{
      const classroom= req.body;
      const result= await ClassRoomCollection.insertOne(classroom)
      res.send(result)

    })
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('ClassRoom is Running')
})

app.listen(port, () => {
    console.log(`my project is running at port ${port}`);
})
