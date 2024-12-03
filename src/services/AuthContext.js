import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (credentials) => {
    try {
      // Log in the user and store username in localStorage
      const response = await axios.post("http://localhost:8080/api/auth/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Assuming the response contains user details like userId, username, and role
      const { username, role } = response.data;

      // Store username in localStorage
      localStorage.setItem("username", username);

      await fetchUserDetails(username, role);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("User registered successfully:", response.data);
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // Fetch user details including the role
  const fetchUserDetails = async (username) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/users`);
      
      // Assuming the response contains userId and role
      const { userId, role } = data;

      // Assuming the response contains username and role
      const loggedInUser = { userId, username, role };
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("Failed to fetch user details:", error.response?.data || error.message);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    setUser(null);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
