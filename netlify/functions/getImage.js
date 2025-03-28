import axios from "axios";

exports.handler = async (event, context) => {
  const { imageUrl } = event.queryStringParameters;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing imageUrl parameter" }),
    };
  }

  try {
    // Récupérer l'image sous forme de flux binaire
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": response.headers["content-type"] || "image/jpeg",
        "Access-Control-Allow-Origin": "*", // Permettre les requêtes cross-origin
        "Cache-Control": "public, max-age=31536000", // Ajouter un cache pour optimiser les performances
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true, // Indiquer que le corps est encodé en base64
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image :", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch the image" }),
    };
  }
};