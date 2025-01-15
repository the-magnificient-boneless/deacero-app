const { chromium } = require("playwright");
const { MongoClient } = require("mongodb");
const axios = require("axios");

const {
  getNeedleFromTheHayStack,
  cleanAndDecodeHtml,
} = require("./utils/needleInTheHayStack");
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

    console.log(`Response for offer ${offerId}:`, response);
    return response;
  } catch (error) {
    console.error(`Error fetching data for offer ${offerId}:`, error.message);
    return null;
  }
}
const extractIdFromUrl = (url) => {
  const regex = /#([A-Fa-f0-9]{32})$/; // Regex para encontrar un hash hexadecimal de 32 caracteres
  const match = url.match(regex); // Intenta hacer una coincidencia en la URL

  if (match) {
    return match[1]; // Devuelve el valor del identificador si se encuentra
  }

  return null; // Si no se encuentra, devuelve null
};
// Configuración de MongoDB
const MONGO_URI = "mongodb://localhost:27017"; // Cambiar si es necesario
const DB_NAME = "alfred-db";
const COLLECTION_NAME = "scrappings";

// Número de URLs a procesar
const NUM_URLS_TO_PROCESS = 1; // Cambiar según necesidad

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
    const context = await browser.newContext({
      extraHTTPHeaders: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        cookie:
          "ut=7AE186A38B3F7427D2C3F4505DE7202C45BCBAABD97796C05B2F7E2B651AC259B955270E4AFBFDD9; ogobu=037C93E531937F0C16597C2A5B4207DB; _fbp=fb.1.1732410460726.60768361735362464; _ga=GA1.1.638920084.1732410461; ct_consent=1; _gcl_au=1.1.1830293040.1732410461; _pprv=eyJjb25zZW50Ijp7IjAiOnsibW9kZSI6Im9wdC1pbiJ9LCIxIjp7Im1vZGUiOiJvcHQtaW4ifSwiMiI6eyJtb2RlIjoib3B0LWluIn0sIjMiOnsibW9kZSI6Im9wdC1pbiJ9LCI0Ijp7Im1vZGUiOiJvcHQtaW4ifSwiNSI6eyJtb2RlIjoib3B0LWluIn0sIjYiOnsibW9kZSI6Im9wdC1pbiJ9LCI3Ijp7Im1vZGUiOiJvcHQtaW4ifX0sInB1cnBvc2VzIjpudWxsLCJfdCI6Im1qamJlMHVpfG0zdXdnamlpIn0%3D; _pcid=%7B%22browserId%22%3A%22m3uwgjigf3pgrxct%22%2C%22_t%22%3A%22mjjbe0uj%7Cm3uwgjij%22%7D; _pctx=%7Bu%7DN4IgrgzgpgThIC4B2YA2qA05owMoBcBDfSREQpAeyRCwgEt8oBJAE0RXSwH18yBbAFaCARlAAMYQQB9%2BAZjAB3AOaD6gkAF8gA; _gcl_gs=2.1.k1$i1732416557$u265378131; _gcl_aw=GCL.1732416559.CjwKCAiAl4a6BhBqEiwAqvrqumzFtTJV-Q4ydhvHW2ZDicYhq1wy9GtFyaD_dWG_iToUvi77R7ogTBoC5_cQAvD_BwE; cla=04676543924F123861373E686DCF3405&97E8BE68C742F2B861373E686DCF3405&3CAE76DA1E4DD1DF61373E686DCF3405&AB6237AC81FAC8B661373E686DCF3405&C4E5C6D1A6A84F8861373E686DCF3405; __rtbh.uid=%7B%22eventType%22%3A%22uid%22%2C%22id%22%3A%22%22%2C%22expiryDate%22%3A%222025-11-25T19%3A20%3A19.801Z%22%7D; _ga_ZG7WXXFNGM=GS1.1.1732562419.12.1.1732562544.0.0.0; __rtbh.lid=%7B%22eventType%22%3A%22lid%22%2C%22id%22%3A%22TgGem4xsckqgOc66jXov%22%2C%22expiryDate%22%3A%222025-11-25T19%3A22%3A24.471Z%22%7D",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });

    // Configurar encabezados predeterminados
    await context.setDefaultNavigationTimeout(60000); // Configurar timeout de navegación
    let processedCount = 0;

    for (const doc of documents) {
      const { urlsWithHash, currentUrl } = doc;

      if (!urlsWithHash || urlsWithHash.length === 0) {
        console.log(
          `El documento con currentUrl: ${currentUrl} no tiene urlsWithHash.`
        );
        continue;
      }

      for (const url of urlsWithHash) {
        if (processedCount >= NUM_URLS_TO_PROCESS) {
          console.log("Límite de URLs a procesar alcanzado.");
          break;
        }

        console.log(`Navegando a URL: ${url}`);
        const page = await context.newPage();

        try {
          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });
          const id = extractIdFromUrl(url);
          console.log(id); // Imprime hashId
          // Fetch offer data and wait for it to complete
          console.log(`Fetching offer data for ID: ${id}`);
          const descripcion = await fetchOfferData(id);
          console.log(`Fetched offer data for: ${id}`);
          console.log(descripcion);
          // Obtener y mostrar el contenido HTML generado
          const htmlContent = await page.content();
          // console.log(`Contenido HTML generado para ${url}:\n`, htmlContent);

          processedCount++;
        } catch (error) {
          console.error(`Error al procesar la URL ${url}:`, error.message);
        } finally {
          await page.close();
        }
      }

      if (processedCount >= NUM_URLS_TO_PROCESS) break;
    }
  } catch (error) {
    console.error("Error general:", error.message);
  } finally {
    if (browser) await browser.close();
    await client.close();
    console.log("Proceso completado.");
  }
})();
