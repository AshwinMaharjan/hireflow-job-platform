import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();

  const hasVerified = useRef(false);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Prevent duplicate API request
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Email verification error:", error);

        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "verifying") {
    return <h2>Verifying your email...</h2>;
  }

  if (status === "success") {
    return (
      <div>
        <h2>Email Verified Successfully!</h2>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Email Verification Failed</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;