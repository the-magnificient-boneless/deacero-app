const path = require("path");
const { lookForSynonym, rimas } = require("../utils/rimaUtils");

exports.lookForSynonym = async (req, res) => {
  try {
    const { word } = req.body;
    const filePath = path.join(
      __dirname,
      "../dataload/diccionario-espanol-txt/0_palabras_todas_no_conjugaciones.txt"
    );

    lookForSynonym(word, filePath)
      .then(() => {
        res.json({ word, rimas });
      })
      .catch((err) => {
        console.error("An error occurred:", err);
        res.status(500).send("Server error");
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
