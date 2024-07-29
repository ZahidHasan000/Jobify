// import cors from "cors";

import express from "express";
const app = express();

import "express-async-errors"

import morgan from "morgan";

import dotenv from "dotenv"
dotenv.config();

// import mongoose from "mongoose";

// db and authenticateUser
import connectDb from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authenticateUser from "./middleware/auth.js";

//cors
// app.use(cors());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"))
}

app.use(express.json());

//cors
app.get("/", (req, res) => {
    res.json({ msg: "Welcome!" })
});

app.get("/api/v1", (req, res) => {
    res.json({ msg: "API" })
});

// app.get("/", (req, res) => {
//     // throw new Error("error");
//     res.send("Welcome!")
// });

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/jobs", jobRouter);

app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// mongoose.set('strictQuery', true);
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(port, () =>
//       console.log(`Server Running on Port: http://localhost:${port}`)
//     );
//   })
//   .catch((error) => console.log(`\n\n${error} did not connect`));
//   console.log("DB connection successfull")


const start = async () => {
    try {

        await connectDb(process.env.MONGO_URL);
        console.log("DB connection successfull")
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {

    }
}

start();