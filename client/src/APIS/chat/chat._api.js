/**
 * Getting existing chat of current user
 */
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
export const GetChattedUsers = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/chat/chatted-users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error checking user existence", error);
    return null;
  }
};
