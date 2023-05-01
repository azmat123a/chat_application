import axios from "axios";

export const checkUserExists = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${uid}`);
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
  return axios
    .post("http://localhost:5000/api/users", userData)
    .then((user) => {
      return user.data;
    })
    .catch((err) => {
      return err;
    });
};
