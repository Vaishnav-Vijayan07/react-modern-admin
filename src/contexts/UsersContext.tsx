import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: number;
  full_name: string;
  rank_id: number;
  blood_group: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  service_start_date: string;
  residential_address: string;
  office_id: number;
  is_active: boolean;
}

interface FormValues {
  full_name: string;
  rank_id: number;
  blood_group: string;
  mobile_number: string;
  email: string;
  password?: string;
  date_of_birth: string;
  service_start_date: string;
  residential_address: string;
  office_id: number;
  is_active: boolean;
}

interface UsersContextType {
  users: User[];
  isLoading: boolean;
  error: string | null;
  addUser: (data: FormValues) => Promise<void>;
  updateUser: (id: number, data: FormValues) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch users",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (data: FormValues) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      await fetchUsers(); // 🚀 Fetch latest users
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add user",
      });
      throw err;
    }
  };

  const updateUser = async (id: number, data: FormValues) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      await fetchUsers(); // 🚀 Fetch latest users
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update user",
      });
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete user",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, isLoading, error, addUser, updateUser, deleteUser }}>{children}</UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { toast } from "@/components/ui/use-toast";

// interface User {
//   id: number;
//   full_name: string;
//   rank_id: number;
//   blood_group: string;
//   mobile_number: string;
//   email: string;
//   date_of_birth: string;
//   service_start_date: string;
//   residential_address: string;
//   office_id: number;
//   status: "active" | "inactive" | "pending";
// }

// interface FormValues {
//   full_name: string;
//   rank_id: number;
//   blood_group: string;
//   mobile_number: string;
//   email: string;
//   password?: string;
//   date_of_birth: string;
//   service_start_date: string;
//   residential_address: string;
//   office_id: number;
//   status: "active" | "inactive" | "pending";
// }

// interface UsersContextType {
//   users: User[];
//   isLoading: boolean;
//   error: string | null;
//   addUser: (data: FormValues) => Promise<void>;
//   updateUser: (id: number, data: FormValues) => Promise<void>;
//   deleteUser: (id: number) => Promise<void>;
// }

// const UsersContext = createContext<UsersContextType | undefined>(undefined);

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";

// export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const getToken = () => {
//     return localStorage.getItem("token") || sessionStorage.getItem("token");
//   };

//   const fetchUsers = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const token = getToken();
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${apiUrl}/api/users`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch users");
//       }

//       const data = await response.json();
//       setUsers(data);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to fetch users",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addUser = async (data: FormValues) => {
//     try {
//       const token = getToken();
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${apiUrl}/api/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add user");
//       }

//       const newUser = await response.json();
//       setUsers((prev) => [...prev, newUser]);
//       toast({
//         title: "Success",
//         description: "User added successfully",
//       });
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to add user",
//       });
//       throw err;
//     }
//   };

//   const updateUser = async (id: number, data: FormValues) => {
//     try {
//       const token = getToken();
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${apiUrl}/api/users/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update user");
//       }

//       const updatedUser = await response.json();
//       setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
//       toast({
//         title: "Success",
//         description: "User updated successfully",
//       });
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to update user",
//       });
//       throw err;
//     }
//   };

//   const deleteUser = async (id: number) => {
//     try {
//       const token = getToken();
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${apiUrl}/api/users/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete user");
//       }

//       setUsers((prev) => prev.filter((user) => user.id !== id));
//       toast({
//         title: "Success",
//         description: "User deleted successfully",
//       });
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to delete user",
//       });
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <UsersContext.Provider value={{ users, isLoading, error, addUser, updateUser, deleteUser }}>{children}</UsersContext.Provider>
//   );
// };

// export const useUsers = () => {
//   const context = useContext(UsersContext);
//   if (!context) {
//     throw new Error("useUsers must be used within a UsersProvider");
//   }
//   return context;
// };
