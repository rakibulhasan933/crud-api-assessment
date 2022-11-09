const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.t2kmaoa.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
	try {
		const Collection = client.db("Minions").collection("products");
		console.log('Database connected');


		// GET API 
		app.get('/minions', async (req, res) => {
			const cursor = Collection.find({});
			const service = await cursor.toArray();
			res.send(service);
		});
		// id specific 
		app.get('/minions/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await Collection.findOne(query);
			res.send(result);
		});

		// POST
		app.post('/minions', async (req, res) => {
			const tv = req.body;
			const result = await Collection.insertOne(tv);
			res.send(result);
		});
		//  update
		app.patch('/minions/:id', async (req, res) => {
			const id = req.params.id;
			const tv = req.body;
			const filter = { _id: ObjectId(id) };
			const updateDoc = {
				$set: {
					name: tv.name,
					age: tv.age,
					color: tv.color
				}
			};
			const result = await Collection.updateOne(filter, updateDoc);
			res.send(result);
		})

		//  DELETED
		app.delete('/minions/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await Collection.deleteOne(query);
			res.send(result);
		});


	} finally {
		// await client.close();
	}
}
run().catch(console.dir);


app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})