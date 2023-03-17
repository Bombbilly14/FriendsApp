import dotenv from 'dotenv';
dotenv.config();


import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import morgan from "morgan"

import authRoutes from "./routes/auth.js"

const app = express()

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err))

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))

//route middlewares
app.use("/api", authRoutes)

app.listen(8000, () => console.log("Server running on port 8000"))




// const express = require("express");
// This works but :(
// const app = express();

// app.get("/api", (req, res) => {
//     res.json({"users": ["userOne", "userTwo", "userThree"]});
// })

// app.listen(5000, () => { console.log("server listening on port 5000 ")})