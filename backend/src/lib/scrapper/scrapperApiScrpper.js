/* const axios = require("axios");
const { MongoClient } = require("mongodb");

// Configuración de MongoDB
const MONGO_URI = "mongodb://localhost:27017"; // Cambiar si es necesario
const DB_NAME = "alfred-db";
const COLLECTION_NAME = "new";

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

// Función principal
(async () => {
  const client = new MongoClient(MONGO_URI);

  try {
    // Conectar a MongoDB
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // URL del API de ScraperAPI (cURL)
    const scraperApiUrl =
      "https://api.scraperapi.com/?api_key=f98f7f5e57c4212e9853e38ab933a36d&url=https%3A%2F%2Fmx.computrabajo.com%2Fempleos-en-jalisco%23AB6237AC81FAC8B661373E686DCF3405&country_code=us";

    // Realizar la solicitud HTTP GET a ScraperAPI
    const response = await axios.get(scraperApiUrl);

    // Obtener el contenido HTML de la respuesta
    const htmlContent = response.data;

    // Escapar los caracteres especiales del HTML
    const escapedContent = escapeHtml(htmlContent);

    // Guardar el contenido escapado en MongoDB
    const document = {
      url: scraperApiUrl, // URL de la API
      content: escapedContent, // Contenido HTML escapado
      date: new Date(), // Fecha actual
    };

    // Insertar el documento en MongoDB
    await collection.insertOne(document);
    console.log("Contenido guardado en MongoDB.");
  } catch (error) {
    console.error("Error general:", error.message);
  } finally {
    // Cerrar la conexión de base de datos
    await client.close();
    console.log("Proceso completado.");
  }
})(); */
