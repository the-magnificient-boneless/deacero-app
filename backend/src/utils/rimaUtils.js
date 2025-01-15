const fs = require("fs");

const vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];

function sustituirAcentos(palabra) {
  const mapaAcentos = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
  };

  return palabra
    .split("")
    .map((letra) => mapaAcentos[letra] || letra)
    .join("");
}

function obtenerVocales(palabra) {
  return palabra
    .toLowerCase()
    .split("")
    .filter((letra) => vocales.includes(letra));
}

function contarCoincidencias(array1, array2) {
  array1.reverse();
  array2.reverse();
  const longitudMinima = Math.min(array1.length, array2.length);

  let coincidencias = 0;
  for (let i = 0; i < longitudMinima; i++) {
    if (array1[i] === array2[i]) {
      coincidencias++;
    } else {
      break;
    }
  }

  return coincidencias;
}

const rimas = []; // Initialize as an array

function obtenerRima(palabra1, palabra2) {
  const vocalesPalabra1 = sustituirAcentos(palabra1);
  const vocalesPalabra2 = sustituirAcentos(palabra2);
  const resultado1 = obtenerVocales(vocalesPalabra1);
  const resultado2 = obtenerVocales(vocalesPalabra2);
  const coincidencias = contarCoincidencias(resultado1, resultado2);

  if (coincidencias > 0) {
    while (rimas.length <= coincidencias) {
      rimas.push([]); // Ensure the array has enough elements
    }
    rimas[coincidencias].push(palabra2);
  }
}

function lookForSynonym(word, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        reject(err); // Reject the Promise on error
        return;
      }

      const words = data.split("\n");

      for (let index = 0; index < words.length; index++) {
        obtenerRima(word, words[index]);
      }
      rimas.sort((a, b) => a - b);
      resolve(rimas); // Resolve the Promise when done
    });
  });
}

module.exports = {
  lookForSynonym,
  rimas,
};
