import { useState } from "react";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Hook for handling login functionality
 * @param onLoginSuccess Function to call after successful login
 * @returns Form state and functions for login
 */
export const useLogin = (onLoginSuccess: VoidFunctionType) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");

  /**
   * Validates the form inputs and attempts to log in the user
   */
  const loginUser = async () => {
    // Reset error messages
    setEmailErr("");
    setPasswordErr("");

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailErr("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordErr("Password cannot be empty");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch("http://localhost:8000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });

        const data = await response.json(); 

        if (response.ok) {
          onLoginSuccess();
        } else {
          if (data.message?.includes("Invalid")) {
            setPasswordErr("Invalid email or password");
          } else {
            setPasswordErr("Login failed");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setPasswordErr("An error occurred during login");
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailErr,
    passwordErr,
    loginUser
  };
};