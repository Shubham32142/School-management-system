import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Routes } from "./Routes/school.routes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors()); // allow cross-orgin

//Connecting to a local server
app.listen(PORT, () => {
  console.log(`Server is running at port --- ${PORT}`);
});
//connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected to mongodb"))
  .catch((err) => console.log({ message: err.message }));

//set up the routes
Routes(app);
