import axios from "axios";

exports.handler = async (event) => {
  const imageUrl = event.queryStringParameters.imageUrl;

  if (!imageUrl || (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://"))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid or missing imageUrl parameter" }),
    };
  }

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": response.headers["content-type"],
        "Access-Control-Allow-Origin": "*", // Allow CORS
      },
      body: response.data.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Error fetching image:", error.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to fetch image" }),
    };
  }
};