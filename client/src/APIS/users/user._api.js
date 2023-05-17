import axios from "axios";

/*
 *checking if user exist already
 */
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const checkUserExists = async (uid) => {
  try {
    const response = await axiosInstance.get(`/api/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error checking user existence", error);
    return null;
  }
};

/*
 *function to upload a profile image to firebase server
 */
export const uploadImage = async (formData) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  return axios
    .post("http://localhost:5000/api/images/upload", formData, config)
    .then((response) => {
      const imageUrl = response.data.imageUrl;
      return imageUrl;
    })
    .catch((err) => {
      return null;
    });
};

/*
 *function to create a new user profile in mongoDb
 */

export const createUserProfile = async (userData) => {
  return axiosInstance
    .post("http://localhost:5000/api/users", userData)
    .then((user) => {
      return user.data;
    })
    .catch((err) => {
      return err;
    });
};

/*
 *function to search user
 */

export const searchUser = async (query, uid) => {
  console.log("createSearchUser", query, uid);
  try {
    const response = await axiosInstance.get(
      `/api/users/search?query=${query}&uid=${uid}`
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error searching for users:", error);
    throw error;
  }
};

export const getUserByJWT = async () => {
  try {
    const response = await axiosInstance.get(`/api/users/user`);
    return response.data;
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.get(`/api/users/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logginout user", error);
    return null;
  }
};
