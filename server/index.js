if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");

// db
require("./config/dbConfig");

// app
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(morgan("common"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// routes middleware
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

app.listen(PORT, () => {
  console.log("Server is listening...");
});
