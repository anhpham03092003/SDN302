const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const httpsErrors = require("http-errors");
require("dotenv").config();
const app = express();
const db = require("./models/index");
const { groupRouter, userRouter, authenticationRouter } = require("./routes");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});
//dinh tuyen theo cac chuc nang thuc te

app.use("/groups", groupRouter);
app.use("/users", userRouter);
app.use("/authentication", authenticationRouter);

app.use(async (req, res, next) => {
  next(httpsErrors(404, "Bad Request"));
});
app.use(async (err, req, res, next) => {
  res.status = err.status || 500;
  res.send({ error: { status: err.status, message: err.message } });
});
const host = process.env.HOSTNAME;
const port = process.env.PORT;
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
  //thuc thi ket noi CSDL
  db.connectDB();
});
