const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@car-project.leyflmf.mongodb.net/?retryWrites=true&w=majority`;
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
    // await client.connect();s
    // Send a ping to confirm a successful connection

    // jobs
    const jobsCollection = client.db('career-hub').collection('jobs');

    // app.get('/jobs', async(req, res)=>{
    //   const cursor = jobsCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    app.get('/jobs/:id', async(req, res)=>{
      const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    // const options = {
    //   // Include only the `title` and `imdb` fields in the returned document
    //   projection: { title: 1, img: 1, service_id: 1, _id: 0, price: 1}
    // };

    const result = await jobsCollection.findOne(query);
    res.send(result);
    })

    app.post('/jobs', async(req, res)=>{
      const newJob = req.body;
      const result = await jobsCollection.insertOne(newJob);
      res.send(result);
    })

    app.get('/jobs', async(req, res)=>{
      console.log(req.query);
  
      let query = {};
      if(req.query?.email){
        query={email: req.query.email}
      }
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    })

        // applied
        const userCollection = client.db('career-hub').collection('users');

        app.get('/applied', async(req, res)=>{
          console.log(req.query);
      
          let query = {};
          if(req.query?.email){
            query={email: req.query.email}
          }
          const result = await userCollection.find(query).toArray();
          res.send(result);
        })


        app.get('/jobs/:id', async (req, res) => {
          const id = req.params.id;
          const result = await jobsCollection.findOne({ _id: new ObjectId(id) })
          res.send(result);
        })


        app.post('/applied', async(req, res)=>{
          const apply = req.body;
          console.log(apply);
          const result = await userCollection.insertOne(apply);
          res.send(result);
    
        })

        app.delete('/jobs/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId (id)}
          const result = await jobsCollection.deleteOne(query);
          res.send(result);
        })

        app.put('/jobs/:id', async (req, res) => {
          const job = req.body;
          console.log(job);
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateJob = {
            $set: {
              jobTitle: job.jobTitle, jobDescription: job.jobDescription, jobCategory: job.jobCategory, 
              img: job.img, logo: job.logo, postingDate: job.postingDate, applicationDeadline: job.applicationDeadline, salaryRange: job.salaryRange, applicants:job.applicants
            },
          };
          const result = await jobsCollection.updateOne(filter, updateJob, options);
          res.send(result);
        })

        app.patch('/jobs/:id', async (req, res) => {
          const job = req.body;
          console.log(job);
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          // const options = { upsert: true };
          const updateJob = {
            $inc: { applicants: 1 } 
          };
          const result = await jobsCollection.updateOne(filter, updateJob);
          res.send(result);
        })

      //   db.products.updateOne(
      //     { _id: "abc123" },
      //     { $inc: { applicants: 1 } }
      //  )
        // app.patch('/jobs/:id', async(req, res)=>{
        //   const update = req.body;
        //   console.log(update);
        //   const id = req.params.id;
        //   const filter = { _id: new ObjectId(id)};
    
        //   const updateDoc = {
        //     $set: {
        //       status: update.status
        //     },
        //   };
    
        //   const result = await jobsCollection.updateOne(filter, updateDoc);
        //   res.send(result);
    
        // })





        // 
        // const userPostCollection = client.db('career-hub').collection('usersPosts');
        // // posted
        // app.post('/posted', async(req, res)=>{
        //   const posted = req.body;
        //   console.log(posted);
        //   const result = await userPostCollection.insertOne(posted);
        //   res.send(result);
    
        // })
       
        // app.get('/posted', async(req, res)=>{
        //   console.log(req.query);
      
        //   let query = {};
        //   if(req.query?.email){
        //     query={email: req.query.email}
        //   }
        //   const result = await userPostCollection.find(query).toArray();
        //   res.send(result);
        // })



    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('career-hub server is running')
})


app.listen(port, ()=>{
    console.log(`career-hub server is running on port: ${port}`);
})