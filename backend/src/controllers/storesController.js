const mongoose = require("mongoose");
const { classifyQuestion } = require("../lib/llm"); // Assuming your AI code is in 'your-ai-module.js'
const { answerQuestion } = require("../lib/llmAsk"); // Assuming your AI code is in 'your-ai-module.js'

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

exports.upsertStores = async (req, res) => {
  try {
    const {
      schemaDefinition,
      schemaOptions,
      collection,
      formData,
      uniqueness,
      notification,
    } = req.body;

    if (
      !schemaDefinition ||
      !collection ||
      !formData ||
      !uniqueness ||
      !notification
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: schemaDefinition, collection, formData, uniqueness, or notification.",
      });
    }
    if (collection.match(/puntobot/i) && "question" in schemaDefinition) {
      const classification = await classifyQuestion(formData.question);
      let answer;
      switch (classification.id_category) {
        case 1:
          answer = await answerQuestion(formData.question);
          break;
        case 2:
          //Pending to create that answers
          //return answer= await answerQuestion(formData.question)
          break;
        case 3:
          //Pending to create that answers
          //return answer= await answerQuestion(formData.question)
          break;
        default:
          answer = "Sin respuesta de interés al usuario";
      }
      formData.classification = classification;
      formData.answer = answer;
    }
    if (!Array.isArray(uniqueness) || uniqueness.length === 0) {
      return res.status(400).json({
        error: "The 'uniqueness' field must be a non-empty array.",
      });
    }

    // Validar el esquema dinámico antes de usarlo
    const Model = getModel(collection, schemaDefinition, schemaOptions || {});

    // Construir el filtro de unicidad dinámicamente
    const filter = {};
    for (const field of uniqueness) {
      if (!formData[field]) {
        return res.status(400).json({
          error: `Missing unique field '${field}' in formData.`,
        });
      }
      filter[field] = formData[field];
    }

    // Realizar la operación upsert
    const updatedDocument = await Model.findOneAndUpdate(filter, formData, {
      upsert: true, // Crea el documento si no existe
      new: true, // Retorna el documento actualizado
      setDefaultsOnInsert: true, // Aplica valores predeterminados al insertar
    });

    // Obtener las entidades según el filtro y orden indicados en notification
    const notViewedEntities = await Model.find({}).sort();
    console.log("Entities -> ", notViewedEntities);
    // Sustituir valores dinámicos en el mensaje de notificación
    const dynamicMessage = notification.message.replace(
      /\[([^\]]+)]/g,
      (_, key) => formData[key] || ""
    );

    // Emitir el evento con la notificación personalizada
    /*     req.io.emit("entityCreated", {
      title: notification.title,
      message: dynamicMessage,
      callToAction: notification.callToAction,
      prospect: updatedDocument,
      newEntities: notViewedEntities,
    }); */

    return res.status(200).json({
      statusCode: 200,
      message: "Upsert operation completed successfully.",
      data: updatedDocument,
    });
  } catch (err) {
    console.error("Error during upsertEntity:", err);
    return res.status(500).json({
      error: `Internal server error. ${err.message}`,
    });
  }
};
// Get all entities with dynamic filters and sorting
exports.getAllStores = async (req, res) => {
  try {
    const { schemaDefinition, schemaOptions, collection } = req.body;

    // Validación de campos obligatorios
    if (!schemaDefinition || !collection) {
      return res.status(400).json({
        error:
          "Missing required fields: schemaDefinition, collection, or notification.",
      });
    }

    // Validar el esquema dinámico antes de usarlo
    const Model = getModel(collection, schemaDefinition, schemaOptions || {});

    // Realizar la búsqueda con el filtro dinámico
    const filter = {}; // Si no se proporciona un filtro, se obtienen todos los documentos
    const sortOption = { createdAt: -1 }; // Prioriza `createdAt DESC`

    // Obtener todas las entidades según el filtro y el orden proporcionado
    const entities = await Model.find(filter).sort(sortOption);

    return res.status(200).json({
      statusCode: 200,
      message: "Entities retrieved successfully.",
      data: entities,
    });
  } catch (err) {
    console.error("Error during getAllEntities:", err);
    return res.status(500).json({
      error: `Internal server error. ${err.message}`,
    });
  }
};
exports.getAllStoresPagination = async (req, res) => {
  try {
    const {
      schemaDefinition,
      schemaOptions,
      collection,
      page = 1,
      limit = 10,
      filters = {},
    } = req.body;

    // Validación de campos obligatorios
    if (!collection) {
      return res.status(400).json({
        error: "Missing required fields: collection.",
      });
    }

    // Validar el esquema dinámico antes de usarlo
    const Model = getModel(collection, schemaDefinition, schemaOptions || {});

    // Calcular el número de documentos a saltar para la paginación
    const skip = (page - 1) * limit;

    // Construir el filtro para filtrar por id_store
    const filter = {};

    if (filters.id_store) {
      filter.id_store = filters.id_store; // Exact match for id_store
    }

    const sortOption = { createdAt: -1 }; // Prioriza `createdAt DESC`

    // Obtener entidades con paginación
    const entities = await Model.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Obtener el total de documentos para la paginación
    const totalDocuments = await Model.countDocuments(filter);

    return res.status(200).json({
      statusCode: 200,
      message: "Entities retrieved successfully.",
      data: entities,
      pagination: {
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error("Error during getAllStoresPagination:", err);
    return res.status(500).json({
      error: `Internal server error. ${err.message}`,
    });
  }
};
