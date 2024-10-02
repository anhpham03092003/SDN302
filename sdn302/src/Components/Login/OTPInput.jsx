import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from '../../Styles/Profile/otp.module.css'; // Import CSS module

export default function OTPInput() {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, otp } = location.state || {};

  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          setDisable(false);
          return 0;
        }
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const resendOTP = () => {
    if (disable) return;
    const newOTP = Math.floor(Math.random() * 9000 + 1000);

    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: newOTP,
        recipient_email: email,
      })
      .then(() => {
        alert("A new OTP has been sent to your email.");
        setTimer(60);
        setDisable(true);
      })
      .catch(console.log);
  };

  const verfiyOTP = () => {
    if (parseInt(OTPinput.join("")) === otp) {
      navigate("/resetPass", { state: { email } });
    } else {
      alert("The code you have entered is not correct, try again or re-send the link.");
    }
  };

  return (
    <div className={styles.login_bg}>
      <div className={styles.wapper}>
        <div className={styles.emailVerification}>
          Email Verification
        </div>
        <div className="text-center text-sm font-medium text-gray-400 mb-4">
          We have sent a code to your email {email}
        </div>

        <div className={styles.otpInputContainer}>
          {OTPinput.map((_, index) => (
            <input
              key={index}
              maxLength="1"
              className={styles.otpInputBox}
              type="text"
              onChange={(e) => {
                const newOTPinput = [...OTPinput];
                newOTPinput[index] = e.target.value;
                setOTPinput(newOTPinput);
              }}
            />
          ))}
        </div>

        <button
          onClick={verfiyOTP}
          className={styles.verifyButton}
        >
          Verify Account
        </button>

        <div className="text-center text-sm font-medium text-gray-500 mt-4">
          <p>Didn't receive code?</p>
          <button
            onClick={resendOTP}
            disabled={disable}
            className={styles.resendOTP}
          >
            {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
