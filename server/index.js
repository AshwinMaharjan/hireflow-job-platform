const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HireFlow API Running");
});
app.get("/about", (req, res) => {
  res.send("About Page");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});