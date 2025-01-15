const throwErrorManually = (req, res) => {
  throw new Error("This is a simulated error!");
};

module.exports = { throwErrorManually };
