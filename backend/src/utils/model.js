const mongoose = require("mongoose");

// Función para crear o reutilizar un modelo dinámico
const getModel = (collectionName, schemaDefinition, schemaOptions) => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName]; // Usa el modelo existente
  }

  // Verificar que todos los campos en schemaDefinition sean válidos
  for (const key in schemaDefinition) {
    const field = schemaDefinition[key];
    if (typeof field === "object" && !field.type) {
      throw new Error(
        `Invalid schema configuration: Missing 'type' for field '${key}'.`
      );
    }
  }

  const schema = new mongoose.Schema(schemaDefinition, schemaOptions);
  return mongoose.model(collectionName, schema);
};
module.exports = { getModel };
