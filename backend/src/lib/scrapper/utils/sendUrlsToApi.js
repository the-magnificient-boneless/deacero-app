const axios = require("axios");
// Enviar datos a la API
const postSendUrlsToApi = async (validUrls, invalidUrls, nextPageUrl, urls) => {
  try {
    const formData = {
      url: urls[0] || "", // Primera URL válida como ejemplo
      invalidUrls: JSON.stringify(invalidUrls),
      validUrls: JSON.stringify(validUrls),
      nextPageUrl: nextPageUrl || "",
    };

    const response = await axios.post(
      "http://localhost:5000/api/entity/store",
      {
        schemaDefinition: {
          esNuevo: {
            type: "Boolean",
            default: true,
          },
          url: {
            type: "String",
            required: true,
          },
        },
        schemaOptions: {
          strict: false,
          timestamps: true,
        },
        collection: "scrapping",
        uniqueness: ["url"],
        notification: {
          title: "¡!",
          message: "",
          callToAction: "Ver todos",
          find: {
            esNuevo: true,
          },
          sort: {
            createdAt: -1,
          },
        },
        formData,
      }
    );

    // console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
module.exports = { postSendUrlsToApi };
