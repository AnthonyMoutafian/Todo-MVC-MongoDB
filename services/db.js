const { MongoClient } = require("mongodb");

const URL =
  "mongodb+srv://AnthonyMou:Ant2026@anthony.uftgglj.mongodb.net/Todo?appName=Anthony";

const client = new MongoClient(URL);

let db;

class DB {
  async connectToDB() {
    await client.connect();

    db = client.db("Todo");

    console.log("MongoDB Connected");
  }

  getDb() {
    return db;
  }
}

module.exports.DB = DB