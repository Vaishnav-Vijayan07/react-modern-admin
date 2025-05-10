import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setIsLoading(false);
          return;
        }
        setUser({
          id: payload.id,
          email: payload.email || "admin@example.com",
          role: payload.role,
        });
      } catch (error) {
        console.error("Failed to parse token:", error);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";
      const response = await fetch(`${apiUrl}/api/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const { token } = await response.json();
      const payload = JSON.parse(atob(token.split(".")[1]));

      const userData: User = {
        id: payload.id,
        email: email,
        role: payload.role,
      };

      setUser(userData);

      if (remember) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
      }

      navigate("/users");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      throw new Error("Registration not implemented for admins");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// interface User {
//   id: string;
//   email: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string, remember?: boolean) => Promise<void>;
//   register: (userData: RegisterData) => Promise<void>;
//   logout: () => void;
// }

// interface RegisterData {
//   fullName: string;
//   email: string;
//   password: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check for stored token on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         // Verify token by decoding (client-side) or calling an API
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         if (payload.exp * 1000 < Date.now()) {
//           // Token expired
//           localStorage.removeItem("token");
//           setIsLoading(false);
//           return;
//         }
//         setUser({
//           id: payload.id,
//           email: payload.email || "admin@example.com", // Fallback if email not in token
//           role: payload.role,
//         });
//       } catch (error) {
//         console.error("Failed to parse token:", error);
//         localStorage.removeItem("token");
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string, remember = false) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Login failed");
//       }

//       const { token } = await response.json();
//       const payload = JSON.parse(atob(token.split(".")[1]));

//       const userData: User = {
//         id: payload.id,
//         email: email,
//         role: payload.role,
//       };

//       setUser(userData);

//       // if (remember) {
//       localStorage.setItem("token", token);
//       // }

//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: RegisterData) => {
//     setIsLoading(true);
//     try {
//       // Placeholder: Implement user registration if needed
//       throw new Error("Registration not implemented for admins");
//     } catch (error) {
//       console.error("Registration failed:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         register,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
