const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();  

const app = express();
const port = process.env.PORT || 3000;

let mongoClient;

async function connectToDatabase() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 

    await mongoClient.connect();  
    console.log("Connected to MongoDB Atlas");
  }

  return mongoClient;
}

app.use(express.json());  

app.post('/location', async (req, res) => {
  try {
    const client = await connectToDatabase();  
    const db = client.db(process.env.DB_NAME || 'all-data');  
    const collection = db.collection(process.env.COLLECTION_NAME || 'article11');  
     const { latitude, longitude, altitude, GoogleMapslocation, time } = req.body;

     const data = {
       latitude,
       longitude,
       altitude,
       GoogleMapslocation,
       timestamp: time || new Date(),  
       receivedAt: new Date(),  
       source: 'ESP8266',  
     };

    await collection.insertOne(data);  
 
    res.status(201).send('Data inserted successfully');  
  } catch (error) {
    console.error("Error inserting data:", error);  
    res.status(500).send(`Error inserting data: ${error.message}`);  
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});
