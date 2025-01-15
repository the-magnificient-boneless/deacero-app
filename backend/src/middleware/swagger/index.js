const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// CommonJS ya tiene __filename y __dirname disponibles
const filename = "*.route.yaml";
const relativePath = path.join(__dirname, filename);

const options = {
  swaggerDefinition: {
    openapi: "3.0.0", // Update for OpenAPI 3.x if needed
    info: {
      title: "deAcero API Test",
      version: "0.1.0",
      description: "A simple API for deAcero stores' inventory",
    },
    servers: [
      {
        url: `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/${process.env.API_ROOT_ENDPOINT}/${process.env.API_VERSION}/`,
      }, // Update with your base URL
    ],
  },
  apis: [relativePath],
};

const specs = swaggerJsdoc(options);
const swagger = {
  endPoint: "/docs",
  serveUI: swaggerUi.serve,
  setupUI: swaggerUi.setup(specs),
};

module.exports = swagger;
