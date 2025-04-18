import { useState } from 'react';
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for handling logout functionality
 * @param onLogoutSuccess Function to call after successful logout
 * @returns The logout function and loading/error states
 */
export const useLogout = (onLogoutSuccess?: VoidFunctionType) => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  /**
   * Logs the user out by calling the logout API endpoint
   */
  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      console.log("Attempting to logout...");
      
      // Using the correct path to access the logout endpoint in the user router
      const response = await fetch('http://localhost:8000/user/logout', {
        method: 'POST',
        credentials: 'include', // Important to include cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Logout response status:", response.status);
      
      if (response.ok) {
        console.log("Logout successful");
        // Call the success callback
        if (onLogoutSuccess) {
          onLogoutSuccess();
        } else {
          // Default behavior if no callback provided
          console.log("No logout success callback provided, refreshing page");
          window.location.reload();
        }
      } else {
        let errorMessage = 'Logout failed';
        
        try {
          const data = await response.json();
          console.error('Logout failed response:', data);
          errorMessage = data.message || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing logout response:', jsonError);
          errorMessage = `Logout failed (${response.status})`;
        }
        
        setLogoutError(errorMessage);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Provide a fallback for logout even when the endpoint fails
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.log("Network error during logout, clearing cookies manually");
        
        // Try to implement a fallback logout by clearing local storage
        try {
          localStorage.clear();
          sessionStorage.clear();
          
          // Clear cookies by setting their expiration in the past
          document.cookie.split(";").forEach((cookie) => {
            const equalPos = cookie.indexOf("=");
            const name = equalPos > -1 ? cookie.substr(0, equalPos).trim() : cookie.trim();
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          });
          
          if (onLogoutSuccess) {
            onLogoutSuccess();
          } else {
            window.location.reload();
          }
          return;
        } catch (fallbackError) {
          console.error('Failed to implement fallback logout:', fallbackError);
        }
      }
      
      setLogoutError('An error occurred during logout. Please try refreshing the page.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut,
    logoutError
  };
};