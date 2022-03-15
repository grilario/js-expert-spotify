import server from "./server.js";
import { logger } from "./utils.js"
import config from "./config.js"

server.listen(config.port)
  .on('listening', () => {
    logger.info(`server running at ${config.port}!!`)
  })