import React, { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { useContext } from "react";
import { AuthContext } from "../../Context/FireBaseContext";
import { createUserProfile, uploadImage } from "../../APIS/users/user._api";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    profileImage: "",
    mobile:""
  });
  const [submitDisable, SetSubmitDisable] = useState(false);
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user,setLoggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // const { setUser } = useContext(AuthContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /*
   *Setting image to preview on upload button event
   */
  const handleImageChange = (e) => {
    setErr(null);
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setErr("Please select a file to upload");
    }
  };

  /*
   *uploading image to firebase server nd getting back URL
   */

  /*
   * form data submission to database
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    SetSubmitDisable(true);
    setLoading(true);
    if (preview) {
      const img_url =await uploadImage(formData);
        // "https://firebasestorage.googleapis.com/v0/b/uploads-50ead.appspot.com/o/images%5C34dad127-ba30-4ab1-9762-8bd79bb4d1e0.jpeg?alt=media";
     
      // console.log(img_url);
      try {
        const userData = {
          uid: user.userId, // Replace with actual user's mobile number
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          bio: formData.bio,
          profileImage: img_url,
          mobile:user.phoneNumber,
        };
        console.log(user);
        createUserProfile(userData)
          .then((userData) => {
            // console.log(user);
            setLoggedInUser(userData);
            navigate("/chat");
            SetSubmitDisable(false);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            SetSubmitDisable(false);
            setLoading(false);
          });
        // console.log("User created successfully:", userResponse.data);
      } catch (error) {
        console.error("Error creating user", error);
        setErr("Error creating user");
        SetSubmitDisable(false);
        setLoading(false);
      }
    } else {
      setErr("Please upload image");
      SetSubmitDisable(false);
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2 className="text-center">FORM</h2>
        <p className="text-center mb-5">Please complete your profile</p>
        {preview && (
          <div className="mt-3 text-center">
            <img src={preview} alt="Preview" />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <div className="form-group">
          <div className="button-container">
            <input
              type="file"
              className="form-control-file"
              id="profileImage"
              name="profileImage"
              onChange={handleImageChange}
              style={{ display: "none" }}
              // required
            />
            <button
              type="button"
              className="btn btn-upload"
              onClick={() => {
                document.getElementById("profileImage").click();
              }}
            >
              Upload Profile Image
            </button>
            <button
              className="btn btn-submit"
              type="submit"
              disabled={submitDisable}
            >
              <div className="d-flex align-items-center justify-content-center">
                <span className="ml-4">Create Profile</span>
                {loading && (
                  <div className="d-flex align-items-center">
                    <CgSpinnerTwo size={30} className="animate-spin" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
        <div className="form-group">
          {err && <p className="text-danger text-center">{err}</p>}
        </div>
      </form>
    </div>
  );
};

export default Profile;
