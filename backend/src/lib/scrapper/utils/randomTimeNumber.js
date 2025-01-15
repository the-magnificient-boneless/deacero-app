function getRandomTimeNumber(min = 30000, max = 60000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/* // Ejemplo de uso
const randomNumber = getRandomTimeNumber();
console.log(randomNumber); */
module.exports = { getRandomTimeNumber };
