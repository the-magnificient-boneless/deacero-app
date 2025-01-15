const mongoose = require("mongoose");
const Code = require("../models/Code"); // Asegúrate de que esta ruta apunte al modelo correcto

// Método para upsert (actualizar si existe, crear si no)
const upsertCode = async (
  file,
  method,
  action = "error",
  statusCode = 500,
  message
) => {
  try {
    // Definir los criterios de búsqueda y los datos de actualización
    const filter = { file, method, action, statusCode, message };
    const update = { file, method, action, statusCode, message }; // O puedes especificar otros campos si deseas actualizarlos

    // Realizar el upsert
    const updatedCode = await Code.findOneAndUpdate(filter, update, {
      upsert: true, // Crea el documento si no existe
      new: true, // Devuelve el documento nuevo o actualizado
      setDefaultsOnInsert: true, // Establece valores predeterminados al crear
    });

    // Retorna el ID del documento (nuevo o actualizado)
    return updatedCode._id;
  } catch (error) {
    console.error(
      "Error al intentar hacer upsert del documento:",
      error.message
    );
    throw error;
  }
};

module.exports = {
  upsertCode,
};
