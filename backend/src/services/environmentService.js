const getEnvironment = (req, res) => {
  res.json({ message: `Environment: ${process.env.ENVIRONMENT}` });
};

module.exports = { getEnvironment };
