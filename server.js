const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routers/acount.router");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", userRouter);

mongoose.connect(
  `mongodb+srv://asadhm:${process.env.MONGODB_PASSWORD}@cluster0.jdmn4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);
app.listen(process.env.PORT || 5000, () => {
  console.log(`listening on port ${process.env.PORT || 5000}`);
});
