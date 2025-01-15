const request = require("request");

function greeting(texto) {
  const saludos = {
    formales: [
      "Estimado/a",
      "Muy señor/a mío/a",
      "Apreciado/a",
      "Saludos cordiales",
      "Con respeto",
      "Le saluda atentamente",
      "Distinguido/a",
      "Es un placer saludarle",
      "Reciba un cordial saludo",
      "A quien corresponda",
      "Con el debido respeto",
      "Es un honor dirigirme a usted",
      "Agradezco su atención",
      "Quedo a su disposición",
      "Con mis mejores deseos",
    ],
    informales: [
      "Hola",
      "Qué tal",
      "Hey",
      "Cómo estás",
      "Buen día",
      "Qué onda",
      "Hola, amigo/a",
      "Qué hay de nuevo",
      "Qué gusto verte",
      "Hola, qué alegría",
      "Ey, qué pasa",
      "Buenas",
      "Saludos",
      "Cómo va todo",
      "Hola, compa",
    ],
  };

  const allSaludos = [...saludos.formales, ...saludos.informales]
    .map((saludo) => saludo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape special characters
    .join("|");

  const regex = new RegExp(allSaludos, "i");
  return regex.test(texto);
}

const message = {
  isGreeting: greeting,
};

module.exports = {
  message,
};
