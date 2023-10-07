require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.NODE_PORT;
const logger = require("./middleware/logger.middleware");

// Init Middleware
app.use(logger);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Members API Route
app.use("/api/members", require("./routes/api/api"));

app.get("/", (req, res) => {
  res.redirect("/api/members");
});

app.listen(port, () => {
  console.log(`Server starting at port ${port}`);
});
