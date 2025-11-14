import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {
  globalErrorHandler,
  catchNotFound,
} from "./src/middlewares/errorHandler.js"


// api routes
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';



const app = express();

// logging http request in dev mode to terminal
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.disable("x-powered-by"); 

//get request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.set('trust proxy', 1); // trust the first proxy in the chain

//test api route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: req.requestTime,
  });
});

// assembling the api routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/products", productRoutes);



//handle route errors
app.use(catchNotFound);

//global error handler
app.use(globalErrorHandler);


//database connection
const connectDb = async () => {
  const connectionOptions = {
    //env files in node when reading must begin with process.env
    dbName: process.env.MONGODB_DB_NAME, //read env file
    serverSelectionTimeoutMs: 45000, //max time to wait for a server to be selected (45secs in ours), if no server selection a timeout error is thrown
    socketTimeoutMs: 5000, //time before socket timesout due to inactivity,useful to avoid hanging connections
    retryWrites: true, //enables automatic retry of some writes operations like insert or update a document
    retryReads: true, //enables automatic retry of read operations
    maxPoolSize: 50, //maximum number of connections in the mongodb conn pool. helps mange concurrent requests
    minPoolSize: 1, //minimum number of connections maintained by mongodb pool
  };
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions
    );
    console.log(`✅ Mongodb Connected: ${conn.connection.host}`);
    //connection event handlers
    mongoose.connection.on("error", (err) =>
      console.error("❌ Mongodb connection error", err)
    );
    mongoose.connection.on("disconnected", () =>
      console.log("ℹ️ Mongodb disconnected")
    );
    //handle graceful shutdown
    const gracefulShutdown = async () => {
      await mongoose.connection.close();
      console.log("ℹ️ Mongodb connection closed through app termination");
      process.exit(0);
    };
    process.on("SIGINT", gracefulShutdown); //ctrl  + c
    process.on("SIGTERM", gracefulShutdown); //a signal to terminate a process
    return conn;
  } catch (error) {
    console.error("❌ Mongodb connection failed", error.message);
    process.exit(1); //exit the process, 1 usually indicates error/failure
  }
};

//server configuration
const PORT = process.env.PORT || 5400;

//handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! ⛔️ Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    //INVOKE OUR DB CONNECTION
    await connectDb();
    //server meeds to run on a port number
    const server = app.listen(PORT, () => {
      console.log(
        `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(`🌎 http://localhost:${PORT}`);
    });
    //handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);

      //close server gracefully
      server.close(() => {
        console.log("🧨 Process terminated due to unhandled rejection");
        process.exit(1);
      });
    });
    //handle graceful shutdown
    const shutdown = async () => {
      console.log("⛔️ Received shutdown signal. Closing server...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });

      //force close if server doesn't close in time
      setTimeout(() => {
        console.error("⚠️ Forcing server shutdown");
        process.exit(0);
      }, 10000);
    };
    //handle termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

//start server
startServer();
