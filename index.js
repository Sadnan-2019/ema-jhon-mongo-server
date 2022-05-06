const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
 
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();
//middiulewarw

// username : Jhone
//pass : 5WRPEEr00JqL7RHf
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rsulx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect(err => {
//   const collection = client.db("EMA-JHONE").collection("product");
//   // perform actions on the collection object
//   console.log("mongo now ok")
//   client.close();
// });

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("EMA-JHONE").collection("product");

    app.get("/product", async (req, res) => {
      console.log("query", req.query);

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      let products;
      const query = {};
      const cursor = productCollection.find(query);

      if (page || size) {

            products = await cursor.skip(page*size).limit(size).toArray();
      } else {
            products = await cursor.toArray();

      }
   
      res.send(products);
    });


    app.post("/product-cart", async (req,res)=>{
          const keys = req.body;
          const ids = keys.map(id => ObjectId(id));
          const query = {_id : {$in: ids}};
          const cursor = productCollection.find(query);
          const products = await cursor.toArray();
          res.send(products)
          console.log(keys)

    });

    app.get("/product-count", async (req, res) => {
//       const query = {};
//       const cursor = productCollection.find(query);
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

  
  }
  
  
  finally {}
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ema backend is running");
});
app.listen(port, () => {
  console.log("jhone is riuning port", port);
});
