/* const axios = require("axios");
const { MongoClient } = require("mongodb");

// Configuración de MongoDB
const MONGO_URI = "mongodb://localhost:27017"; // Cambiar si es necesario
const DB_NAME = "alfred-db";
const SOURCE_COLLECTION = "scrappings";
const DEST_COLLECTION = "new";

// Función para escapar caracteres HTML
const escapeHtml = (str) => {
  return str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return char;
    }
  });
};

// Construir la URL de ScraperAPI
const buildScraperApiUrl = (url) => {
  const apiKey = "f98f7f5e57c4212e9853e38ab933a36d"; // Cambiar si es necesario
  return `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
    url
  )}&country_code=us`;
};

// Función principal
(async () => {
  const client = new MongoClient(MONGO_URI);
  try {
    // Conectar a MongoDB
    await client.connect();
    const db = client.db(DB_NAME);
    const sourceCollection = db.collection(SOURCE_COLLECTION);
    const destCollection = db.collection(DEST_COLLECTION);

    // Consultar las URLs de la colección original
    const documents = await sourceCollection.find({}).toArray();

    if (documents.length === 0) {
      console.log("No se encontraron documentos en la colección.");
      return;
    }

    for (const doc of documents) {
      const { urlsWithHash } = doc;

      if (!urlsWithHash || urlsWithHash.length === 0) {
        console.log(`El documento con ID: ${doc._id} no tiene urlsWithHash.`);
        continue;
      }

      for (const originalUrl of urlsWithHash) {
        // Construir la nueva URL para ScraperAPI
        const scraperApiUrl = buildScraperApiUrl(originalUrl);

        try {
          // Realizar la solicitud GET a ScraperAPI
          const response = await axios.get(scraperApiUrl);

          // Escapar el contenido HTML
          const escapedContent = escapeHtml(response.data);

          // Guardar el contenido en MongoDB
          const document = {
            originalUrl, // URL original
            scraperApiUrl, // URL de ScraperAPI
            content: escapedContent, // Contenido HTML escapado
            date: new Date(), // Fecha de extracción
          };

          await destCollection.insertOne(document);
          console.log(`Guardado el contenido de ${originalUrl}`);
        } catch (error) {
          console.error(`Error al procesar ${originalUrl}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error("Error general:", error.message);
  } finally {
    // Cerrar la conexión de base de datos
    await client.close();
    console.log("Proceso completado.");
  }
})(); */

// Método para obtener HTML guardado de MongoDB
const getHtmlContent = async (originalUrl) => {
  const client = new MongoClient(MONGO_URI);
  try {
    // Conectar a MongoDB
    await client.connect();
    const db = client.db(DB_NAME);
    const destCollection = db.collection(DEST_COLLECTION);

    // Consultar el documento por URL original
    const document = await destCollection.findOne({ originalUrl });
    if (!document) {
      return "Contenido no encontrado para esta URL.";
    }

    // Devolver el contenido escapado
    return document.content;
  } catch (error) {
    console.error("Error al obtener contenido:", error.message);
    return null;
  } finally {
    // Cerrar la conexión
    await client.close();
  }
};

// Ejemplo de uso del método `getHtmlContent`
// (async () => {
//   const html = await getHtmlContent("https://mx.computrabajo.com/empleos-en-jalisco#AB6237AC81FAC8B661373E686DCF3405");
//   console.log(html);
// })();
