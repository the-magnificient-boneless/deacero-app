// src/routes/index.js
const { Router } = require("express");
const passport = require("passport"); // Import passport
const basicAuth = require("express-basic-auth");
const middleware = require("../../middleware/");

const authRoutes = require("./authRoutes");
const environmentRoutes = require("./environmentRoutes");
const testRoutes = require("./testRoutes");
const prospectRoutes = require("./prospectRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const userRoutes = require("./userRoutes");
const postalCodesRoutes = require("./postalCodesRoutes");
const entityRoutes = require("./entityRoutes");
const productsRoutes = require("./productsRoutes");
const storesRoutes = require("./storesRoutes");
const classifyRoutes = require("./classifyRoutes");
const puntoBotRoutes = require("./puntoBotRoutes");

const router = Router();

// Define route for the root URL
router.get("/", (_req, res) => res.send("Hello World"));

// Register the other routes
router.use("/auth", authRoutes);
router.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  userRoutes
);
router.use(
  "/entity",
  passport.authenticate("jwt", { session: false }),
  entityRoutes
);
router.use(
  "/products",
  passport.authenticate("jwt", { session: false }),
  productsRoutes
);
router.use(
  "/stores",
  passport.authenticate("jwt", { session: false }),
  storesRoutes
);
router.use("/environment", environmentRoutes);
router.use("/test", testRoutes);

//router.use("/prospects", prospectRoutes);
//router.use("/dashboard", dashboardRoutes);
//router.use("/postal-codes", postalCodesRoutes);
//router.use("/classify", classifyRoutes);
//router.use("/puntoBot", puntoBotRoutes);

// Handle the image upload route
//router.post("/upload", (req, res) => {
// Image upload handling
//  res.send("Image uploaded");
//});

//Swagger is only available in dev environment
if (process.env.ENVIRONMENT === "dev") {
  router.use(
    middleware.swagger.endPoint,
    basicAuth({
      users: { [process.env.SWAGGER_ADMIN]: process.env.SWAGGER_PASSWORD },
      challenge: true,
    }),
    middleware.swagger.serveUI,
    middleware.swagger.setupUI
  );
}
//Testing protected endpoint by token
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { apiKey } = req.body;
    res.json({
      message: `Welcome, this is a protected route. APIkey: ${apiKey}`,
    });
  }
);

// Expose metrics endpoint
router.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
module.exports = router;
