import express from "express";
import credentials from "./middleware/credentials.middleware";
import corsOptions from "./config/corsOptions";
import cors from "cors";
import errorLogger from "./middleware/logger/error-logger.middleware";
import requestLogger from "./middleware/logger/request-logger.middleware";
import apiRouter from "./api.route";
import errorHandler from "./middleware/errorHandler.middleware";

const app = express();

// Request logger needs to be first so it will log all requests
app.use(requestLogger);

// Enable CORS credentials for allowed origins
app.use(credentials);

// Built in middleware for resource sharing
app.use(cors(corsOptions));

// Built in middleware for json
app.use(express.json());

// Built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api", apiRouter);

// Error logger should be after all middleware and routers
app.use(errorLogger);

// Error handler should be after all middleware and routers
app.use(errorHandler);

export default app;
