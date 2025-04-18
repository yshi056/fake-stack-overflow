import { useState } from "react";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Hook for handling signup functionality
 * @param onSignupSuccess Function to call after successful signup
 * @returns Form state and functions for signup
 */
export const useSignup = (onSignupSuccess: VoidFunctionType) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [usernameErr, setUsernameErr] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState<string>("");

  /**
   * Validates the form inputs and registers the user if all validations pass
   */
  const registerUser = async () => {
    // Reset error messages
    setUsernameErr("");
    setEmailErr("");
    setPasswordErr("");
    setConfirmPasswordErr("");

    let isValid = true;

    // Validate username
    if (!username.trim()) {
      setUsernameErr("Username cannot be empty");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameErr("Username must be at least 3 characters");
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailErr("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordErr("Password cannot be empty");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordErr("Password must be at least 6 characters");
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordErr("Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch("http://localhost:8000/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          onSignupSuccess();
        } else {
          if (data.message?.includes("exists")) {
            setUsernameErr("Username or email already exists");
          } else {
            setUsernameErr("Signup failed");
          }
        }
      } catch (error) {
        console.error("Signup error:", error);
        setUsernameErr("An error occurred during signup");
      }
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    usernameErr,
    emailErr,
    passwordErr,
    confirmPasswordErr,
    registerUser
  };
};