import cors from "cors";
import mongoose from "mongoose";
import { Server } from "http"; // Import the Server type from Node.js
import express, { type Express, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import { middleware } from "express-openapi-validator";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';


import question from "./routers/questions";
import tag  from "./routers/tags";
import answer  from "./routers/answers";
import user from "./routers/user";
import authRouter from './routers/auth';

const MONGO_URL: string = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL: string = "http://localhost:3000";
const port: number = 8000;

mongoose.connect(MONGO_URL);
dotenv.config();

const app: Express = express();

// The middleware function to allow cross-origin requests from the client URL.
app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

// The middleware function to parse the request body.
app.use(express.json());
app.use(cookieParser()); // Added cookie parser middleware

// Defining the path to the Open API specification file and parsing it.
const openApiPath = path.join(__dirname, 'openapi.yaml');
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, 'utf8'));

// Defining the Swagger UI options. Swagger UI renders the Open API specification file.
const swaggerOptions = {
  customSiteTitle: "Fake Stack Overflow API Documentation",
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }',
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: 'none',
    showCommonExtensions: true
  }
};

// The middleware function to serve the Swagger UI with the Open API specification file.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, swaggerOptions));

// The middleware function to validate the request and response against the Open API specification.
app.use(
  middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: true,
    formats: {
      'mongodb-id': /^[0-9a-fA-F]{24}$/
    }
  })
);

const server: Server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

// Gracefully shutdown the server and the database connection when the process is terminated.
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed.");
  });
  mongoose
    .disconnect()
    .then(() => {
      console.log("Database instance disconnected.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during disconnection:", err);
      process.exit(1);
    });
});

// The middleware function to handle errors.
app.use((err: { status?: number; errors?: unknown[]; message?: string }, req: Request, res: Response, next: NextFunction) => {
  if (err.status && err.errors) {
    console.error("Error:", err);
    res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  } else {
    console.error("Internal Server Error:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
  next(); // Ensure the next middleware is called to avoid eslint warnings
});

app.use("/question", question);
app.use("/tag", tag);
app.use("/answer", answer);
app.use("/user", user);
app.use('/auth', authRouter);

module.exports = server;
