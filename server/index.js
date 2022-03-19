import Server from "./server.js";
import { logger } from "./utils.js";
import config from "./config.js";

Server().listen(config.port).on("listening", () => {
  logger.info(`server running at ${config.port}!!`);
});

process.on("uncaughtException", (error) => {
  logger.error(`uncaughtException happened: ${error.stack || error}`);
});
process.on("unhandledRejection", (error) => {
  logger.error(`unhandledRejection happened: ${error.stack || error}`);
});
