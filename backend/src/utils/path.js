const path = require("path");

const getCurrentPathAndFile = () => {
  // __filename contiene la ruta completa del archivo actual
  const fullPath = __filename;
  // __dirname contiene solo la ruta del directorio
  const dirPath = __dirname;
  // Extraemos solo el nombre del archivo
  const fileName = path.basename(fullPath);

  return {
    fullPath,
    dirPath,
    fileName,
  };
};

module.exports = {
  getCurrentPathAndFile,
};
