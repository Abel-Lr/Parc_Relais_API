const express = require("express");
const app = express();
require("dotenv").config();
const fetchApi = require("./lib/fetchAPI");
const path = require("path");
const port = process.env["PORT"] || 8080;

app.get("/", async (req, res) => {
  let result = await fetchApi();
  res.render(path.join(__dirname, "views", "index.ejs"), {
    values: result["values"],
  });
});

app.get("/view/:parc", (req, res) => {
  const id = req.params["parc"];
});

app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
