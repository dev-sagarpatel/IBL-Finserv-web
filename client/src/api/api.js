import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const postData = async ({ userData, endpoints }) => {
  try {
    const { data } = await axios.post(`${url}${endpoints}`, userData);
    return data;
  } catch (error) {
    throw error.response || error.response.message;
  }
};
