const logger = require("../config/logger");

exports.loggerTest = (req, res) => {
  logger.debug("Este es un mensaje de debug");
  logger.http("Este es un mensaje de http");
  logger.info("Este es un mensaje de info");
  logger.warn("Este es un mensaje de warning");
  logger.error("Este es un mensaje de error");
  logger.fatal("Este es un mensaje de fatal");
  
  res.send("Logs generados. Verifica la consola y los archivos de logs.");
};
