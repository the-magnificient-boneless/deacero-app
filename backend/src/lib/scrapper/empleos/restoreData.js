const { MongoClient } = require("mongodb");
const {
  getNeedleFromTheHayStack,
  cleanAndDecodeHtml,
} = require("../utils/needleInTheHayStack");
const axios = require("axios");

// Esperar un número aleatorio de milisegundos
const waitRandomTime = (min = 1000, max = 5000) =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );

async function storeEntity(data) {
  try {
    const url = "http://localhost:5000/api/entity/store";

    const response = await axios.post(url, data, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        Origin: "http://localhost:5001",
        Referer: "http://localhost:5001/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
    });

    console.log("Response from storeEntity:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error storing entity:", error.message);
    return null;
  }
}

async function fetchOfferData(offerId) {
  try {
    await waitRandomTime(2000, 10000); // Espera entre 2 y 7 segundos

    const url = `https://oferta.computrabajo.com/offer/${offerId}/d/j?ipo=2&iapo=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Origin: "https://mx.computrabajo.com",
        Connection: "keep-alive",
        Referer: "https://mx.computrabajo.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    });

    console.log(`Response for offer ${offerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for offer ${offerId}:`, error.message);
    return null;
  }
}

// Configuración de MongoDB
const MONGO_URI = "mongodb://localhost:27017"; // Cambiar si es necesario
const DB_NAME = "alfred-db";
const COLLECTION_NAME = "new";

/**
 * Lee y procesa documentos de la colección "new".
 * @param {number|boolean} limit - Número máximo de documentos a procesar false para no limitar.
 */
const restoreEmpleos = async (limit = 10) => {
  const client = new MongoClient(MONGO_URI);

  try {
    // Conectar a MongoDB
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    let documentos;

    // Obtener documentos con límite
    if (limit !== false) {
      documentos = await collection.find({}).limit(limit).toArray();
    } else {
      documentos = await collection.find({}).toArray();
    }

    if (documentos.length === 0) {
      console.log("No hay documentos en la colección.");
      return;
    }

    // Procesar los documentos con límite
    const documentsToProcess = documentos.slice(0, limit);

    for (const doc of documentsToProcess) {
      const decoded = cleanAndDecodeHtml(doc.content);
      const titulo = getNeedleFromTheHayStack(
        decoded,
        'c=ListOffers-Score-0"> ',
        " </a>"
      );
      const empresa = getNeedleFromTheHayStack(
        decoded,
        "grid-article-company-url> ",
        " </a>"
      );
      const lugar = getNeedleFromTheHayStack(
        decoded,
        '<span class="mr10"> ',
        " </span>"
      );
      const tipoContrato = getNeedleFromTheHayStack(
        decoded,
        " data-path='?cont=1' rel=nofollow >",
        "</span>"
      );
      const jornada = getNeedleFromTheHayStack(
        decoded,
        "-jornada-tiempo-completo' rel=nofollow >",
        "</span>"
      );
      const jornadaMedio = getNeedleFromTheHayStack(
        decoded,
        '-medio-tiempo\' title="" >',
        "</a>"
      );
      const sueldo = getNeedleFromTheHayStack(
        decoded,
        '<span class="icon i_salary"></span> ',
        "</span>"
      );
      const jornadaHoras = getNeedleFromTheHayStack(
        decoded,
        '-por-horas" title="" >',
        "</a>"
      );

      // Fetch offer data and wait for it to complete
      console.log(`Fetching offer data for ID: ${doc.prettified}`);
      const descripcion = await fetchOfferData(doc.prettified);
      console.log(`Fetched offer data for: ${doc.prettified}`);

      const formData = {
        titulo,
        empresa,
        lugar,
        tipoContrato,
        jornada,
        jornadaMedio,
        jornadaHoras,
        sueldo,
        descripcion,
      };

      // Prepare entity data for storage
      console.log("Preparing to store entity with form data:", formData);
      const entityData = {
        schemaDefinition: {
          descripcion: {
            type: "String",
          },
          esNuevo: {
            type: "Boolean",
            default: true,
          },
          archivado: {
            type: "Boolean",
            default: false,
          },
        },
        schemaOptions: {
          strict: false,
          timestamps: true,
        },
        collection: "empleos",
        uniqueness: ["descripcion"],
        notification: {
          title: "¡Registro guardado!",
          message:
            "[nombre] [apellidoPaterno] [apellidoMaterno] se ha postulado.",
          callToAction: "Ver postulación",
          find: {
            esNuevo: true,
          },
          sort: {
            createdAt: -1,
          },
        },
        formData,
      };

      // Store entity and log the success
      await storeEntity(entityData);
      console.log("Entity stored successfully.");
    }
  } catch (error) {
    console.error("Error al procesar documentos:", error.message);
  } finally {
    // Cerrar conexión a la base de datos
    await client.close();
    console.log("Conexión a MongoDB cerrada.");
  }
};

// Llamada al script con un límite (puedes ajustar este valor)
const limite = 1; // Cambia el valor según sea necesario
restoreEmpleos(limite);
