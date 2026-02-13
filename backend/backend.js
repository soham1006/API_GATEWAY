const express = require("express");
const app = express();

app.get("/products", (req, res) => {
  res.json([{ id: 1, name: "Laptop" }]);
});

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "John" }]);
});

app.listen(4000, () => console.log("Backend running on 4000"));
