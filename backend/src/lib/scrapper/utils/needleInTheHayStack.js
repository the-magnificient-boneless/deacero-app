const he = require("he");

/**
 * Limpia y decodifica una cadena de texto.
 */
const cleanAndDecodeHtml = (text) => {
  if (!text) return "";
  return he
    .decode(text)
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

/**
 * Extrae el texto entre un texto inicial y un texto final.
 */
const getNeedleFromTheHayStack = (content, textoInicial, textoFinal) => {
  // const cleanedContent = cleanAndDecodeHtml(content);
  const cleanedContent = content;
  const inicio = cleanedContent.indexOf(textoInicial);
  const fin = cleanedContent.indexOf(textoFinal, inicio + textoInicial.length);

  if (inicio !== -1 && fin !== -1) {
    return cleanedContent.substring(inicio + textoInicial.length, fin).trim();
  }

  return null;
};

module.exports = {
  getNeedleFromTheHayStack,
  cleanAndDecodeHtml,
};
