import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import PhoneInput from "react-phone-input-2";
import OtpInput from "otp-input-react";
import "react-phone-input-2/lib/material.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { CgSpinnerTwo } from "react-icons/cg";

///
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/FireBaseContext";
import { checkUserExists } from "../../APIS/users/user._api";

//
import "./login.css";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(true);
  const [disable, setDisable] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const { setUser, setLoggedInUser, setIsAuthenticated } =
    useContext(AuthContext);
  /*
   *Built in captcha functionality
   */
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            handle_otp_send();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  /*
   *Sign in method
   */
  const handle_otp_send = () => {
    // redirectUser("WgTArHQRoGf3P5PJAMHpZ2oq3rn1");
    setDisable(true);
    setLoading(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + phoneNumber;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setLoginForm(false);
        setDisable(false);
        setErrMsg("");
        // toast.success("OTP sended successfully!");
        console.log("sent");
      })
      .catch((error) => {
        console.log(error.message);
        setErrMsg(error.message);
        setLoading(false);
        setDisable(false);
      });
  };

  /*
   *Otp verification method
   */
  const handle_otp_verify = () => {
    setDisable(true);
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        redirectUser(res.user.uid, res.user.phoneNumber);
        setLoading(false);
        setDisable(false);
        setErrMsg("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setDisable(false);
        setErrMsg(err.message);
      });
  };

  /*
   * user navigation to specific page
   */
  const redirectUser = async (userId) => {
    const response = await checkUserExists(userId);

    if (response && response.exists) {
      // Update the user state in AuthContext

      setLoggedInUser(response.user);
      setIsAuthenticated(true);
      navigate("/chat");
    } else if (response && !response.exists) {
      // Update the user state in AuthContext with a temporary user object
   
      setUser({ userId, phoneNumber });
      // Redirect to the profile completion page
      setIsAuthenticated(true);
      navigate("/profile");
    } else {
      // Handle error (e.g., show a message to the user)
    }
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="main_container_login">
          <div className="d-flex flex-column text-center justify-content-center align-items-center">
            <Logo style={{ width: "10em", height: "10em" }} />
            <h2>Hello Again!</h2>
          </div>
          {loginForm ? (
            <div className="d-flex flex-column text-center phone_section justify-content-center align-items-center">
              <h4>SIGN IN</h4>
              <p>Please sign in to continue</p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PhoneInput
                  country={"pk"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  specialLabel={"Mobile Number"}
                />
              </div>
              {errMsg?.length > 0 && <p className="error_message">{errMsg}</p>}
              <button
                className="btn otp_btn"
                onClick={handle_otp_send}
                disabled={disable}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <span className="ml-4">Send OTP</span>
                  {loading && (
                    <div className="d-flex align-items-center">
                      <CgSpinnerTwo size={30} className="animate-spin" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          ) : (
            <div className="d-flex justify-content-center flex-column align-items-center verification_section">
              <p>Please enter OTP received on you number</p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="opt-container"
              ></OtpInput>
              {errMsg?.length > 0 && <p className="error_message">{errMsg}</p>}
              <button
                className="btn btn-primary mt-3 otp_verify_btn"
                onClick={handle_otp_verify}
                disabled={disable}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <span className="ml-4">Verify OTP</span>
                  {loading && (
                    <div className="d-flex align-items-center">
                      <CgSpinnerTwo size={30} className="animate-spin" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default App;
