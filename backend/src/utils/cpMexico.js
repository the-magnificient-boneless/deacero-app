const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const { MongoClient } = require("mongodb");
const xlsx = require("xlsx");

const processFileAndInsertToDB = async (filename, dbName, collectionName) => {
  // Validar extensión del archivo
  const allowedExtensions = [".txt", ".csv", ".xls", ".xlsx"];
  const fileExtension = filename.slice(filename.lastIndexOf("."));
  if (!allowedExtensions.includes(fileExtension)) {
    console.error("Error: Solo se permiten archivos .txt, .csv, .xls y .xlsx");
    return;
  }

  // Verificar si el archivo existe
  if (!fs.existsSync(filename)) {
    console.error("Error: El archivo no existe");
    return;
  }

  console.log(`Leyendo archivo: ${filename}\n`);

  // Variables para estadísticas
  let totalDocuments = 0;
  const batchSize = 100; // Tamaño del lote para inserciones masivas
  let batch = [];

  // Configuración de MongoDB
  const uri = "mongodb://127.0.0.1:27017"; // URL de conexión local
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    if (fileExtension === ".txt" || fileExtension === ".csv") {
      // Procesar archivos de texto o CSV
      const stream = fs
        .createReadStream(filename)
        .pipe(iconv.decodeStream("utf-8"));

      const readline = require("readline");
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity, // Manejar saltos de línea
      });

      // Procesar línea por línea
      for await (const line of rl) {
        const fields = line.split("|");

        const document = {
          d_codigo: fields[0],
          d_asenta: fields[1],
          d_tipo_asenta: fields[2],
          D_mnpio: fields[3],
          d_estado: fields[4],
          d_ciudad: fields[5],
          d_CP: fields[6],
          c_estado: fields[7],
          c_oficina: fields[8],
          c_CP: fields[9],
          c_tipo_asenta: fields[10],
          c_mnpio: fields[11],
          id_asenta_cpcons: fields[12],
          d_zona: fields[13],
          c_cve_ciudad: fields[14],
        };

        batch.push(document);

        if (batch.length === batchSize) {
          await collection.insertMany(batch);
          totalDocuments += batch.length;
          batch = [];
        }
      }

      if (batch.length > 0) {
        await collection.insertMany(batch);
        totalDocuments += batch.length;
      }
    } else if (fileExtension === ".xls" || fileExtension === ".xlsx") {
      // Procesar archivos Excel
      const workbook = xlsx.readFile(filename);
      const sheetNames = workbook.SheetNames;

      for (const sheetName of sheetNames) {
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: [
            "d_codigo",
            "d_asenta",
            "d_tipo_asenta",
            "D_mnpio",
            "d_estado",
            "d_ciudad",
            "d_CP",
            "c_estado",
            "c_oficina",
            "c_CP",
            "c_tipo_asenta",
            "c_mnpio",
            "id_asenta_cpcons",
            "d_zona",
            "c_cve_ciudad",
          ],
          defval: null, // Valores predeterminados para celdas vacías
        });

        for (const row of sheetData) {
          batch.push(row);

          if (batch.length === batchSize) {
            await collection.insertMany(batch);
            totalDocuments += batch.length;
            batch = [];
          }
        }
      }

      if (batch.length > 0) {
        await collection.insertMany(batch);
        totalDocuments += batch.length;
      }
    }

    console.log("\nArchivo procesado exitosamente.");
    console.log(`Total de documentos insertados: ${totalDocuments}`);
  } catch (err) {
    console.error(
      `Error al procesar el archivo o conectar con MongoDB: ${err.message}`
    );
  } finally {
    // Cerrar conexión a MongoDB
    await client.close();
    console.log("Conexión con MongoDB cerrada.");
  }
};

// Uso
const filename = path.resolve(__dirname, "../dataload/cp/CPdescarga.xls"); // Ruta relativa convertida a absoluta
const dbName = "alfred-db"; // Nombre de la base de datos
const collectionName = "postalcodes"; // Nombre de la colección
processFileAndInsertToDB(filename, dbName, collectionName);
