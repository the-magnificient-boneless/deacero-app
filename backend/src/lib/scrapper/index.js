// Importar módulos necesarios
const { chromium } = require("playwright");
const { MongoClient } = require("mongodb");

// Configuración de MongoDB
const MONGO_URI = "mongodb://localhost:27017"; // Cambiar si es necesario
const DB_NAME = "alfred-db";
const COLLECTION_NAME = "scrappings";

// Función para obtener un User-Agent aleatorio
const getRandomUserAgent = () => {
  const userAgents = [
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Función para retrasar la ejecución (anti-bot)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para simular el movimiento del mouse (anti-bot)
const moveMouseRandomly = async (page) => {
  const viewportWidth = await page.viewportSize().width;
  const viewportHeight = await page.viewportSize().height;

  // Mover el mouse a una posición aleatoria en la pantalla
  const x = Math.floor(Math.random() * viewportWidth);
  const y = Math.floor(Math.random() * viewportHeight);

  await page.mouse.move(x, y);
  await delay(1000 + Math.random() * 2000); // Espera aleatoria entre 1 y 3 segundos
};

// Función principal
(async () => {
  const client = new MongoClient(MONGO_URI);
  let browser;

  try {
    // Conectar a MongoDB
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Obtener documentos de la colección
    const documents = await collection.find({}).toArray();

    if (documents.length === 0) {
      console.log("No hay documentos en la colección.");
      return;
    }

    // Iniciar Playwright
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    for (const doc of documents) {
      const { urlsWithHash, currentUrl } = doc;

      if (!urlsWithHash || urlsWithHash.length === 0) {
        console.log(
          `El documento con currentUrl: ${currentUrl} no tiene urlsWithHash.`
        );
        continue;
      }

      for (const url of urlsWithHash) {
        console.log(`Navegando a URL: ${url}`);

        // Configurar un User-Agent aleatorio y viewport
        const userAgent = getRandomUserAgent();
        const viewportWidth =
          Math.floor(Math.random() * (1920 - 1024 + 1)) + 1024;
        const viewportHeight =
          Math.floor(Math.random() * (1080 - 768 + 1)) + 768;

        await context.setDefaultNavigationTimeout(60000);
        await context.setDefaultTimeout(60000);

        const page = await context.newPage({
          userAgent,
          viewport: { width: viewportWidth, height: viewportHeight },
        });

        try {
          // Ir a la URL
          await page.goto(url, { waitUntil: "domcontentloaded" });

          // Anti-bot: Simular desplazamiento en la página
          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight / 2);
          });
          await delay(1000 + Math.random() * 2000); // Espera aleatoria entre 1 y 3 segundos

          // Simular movimiento del mouse
          await moveMouseRandomly(page);

          // Extraer encabezados
          const headers = await page.evaluate(() => {
            const extractText = (selector) =>
              Array.from(document.querySelectorAll(selector)).map((el) =>
                el.innerText.trim()
              );

            return {
              h1: extractText("h1"),
              h2: extractText("h2"),
              h3: extractText("h3"),
            };
          });

          console.log(`Encabezados extraídos de ${url}:`, headers);
        } catch (error) {
          console.error(`Error al procesar la URL ${url}:`, error.message);
        } finally {
          await page.close();
        }
      }
    }
  } catch (error) {
    console.error("Error general:", error.message);
  } finally {
    // Cerrar navegador y conexión de base de datos
    if (browser) await browser.close();
    await client.close();
    console.log("Proceso completado.");
  }
})();
