const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.post("/api/zoos", async (req, res) => {
  try {
    const [id] = await db("zoos").insert(req.body);
    res.status(201).json(id);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occured" });
  }
});

server.get("/api/zoos", async (req, res) => {
  try {
    const animals = await db("zoos");
    res.status(200).json(animals);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occured" });
  }
});

server.get("/api/zoos/:id", async (req, res) => {
  try {
    const animal = await db("zoos").where({ id: req.params.id });
    res.status(200).json(animal);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occured" });
  }
});

server.delete("/api/zoos/:id", async (req, res) => {
  try {
    const id = await db("zoos")
      .where({ id: req.params.id })
      .del();

    if (id > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Animal not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occured" });
  }
});

server.put("/api/zoos/:id", async (req, res) => {
  try {
    const id = await db("zoos")
      .where({ id: req.params.id })
      .update(req.body);

    if (id > 0) {
      res.status(200).json(id);
    } else {
      res.status(404).json({ message: "Animal not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occured" });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
