import axios from "axios";

export const fetchImage = async (imageUrl) => {
  try {
    const response = await axios.get(`/.netlify/functions/getImage?imageUrl=${encodeURIComponent(imageUrl)}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("fetchImage error :", error);
    throw error;
  }
};
