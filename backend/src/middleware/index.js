const swagger = require("./swagger");
const handle404 = require("./error404");

const middlewares = {
  swagger,
  handle404,
};

module.exports = middlewares;
