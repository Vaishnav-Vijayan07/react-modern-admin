import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router";

interface OfficeType {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  alternate_email: string;
  alternate_phone_number: string;
  address: string;
}

interface OfficeTypesContextType {
  officeTypes: OfficeType[];
  isLoading: boolean;
  error: string | null;
  getOfficeTypes: () => Promise<void>;
  addOfficeType: (data: FormValues) => Promise<void>;
  updateOffice: (id: number, data: FormValues) => Promise<void>;
  deleteOffice: (id: number) => Promise<void>;
}

interface FormValues {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  alternate_email: string;
  alternate_phone_number: string;
}

const OfficeTypesContext = createContext<OfficeTypesContextType | undefined>(undefined);

export const useOfficeTypes = () => {
  const context = useContext(OfficeTypesContext);
  if (context === undefined) {
    throw new Error("useOfficeTypes must be used within an OfficeTypesProvider");
  }
  return context;
};

export const OfficeTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [officeTypes, setOfficeTypes] = useState<OfficeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  const getOfficeTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";
      console.log("Fetching offices from:", `${apiUrl}/api/offices`);
      const response = await fetch(`${apiUrl}/api/offices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch offices");
      }

      const data = await response.json();
      console.log("Offices fetched:", data);
      setOfficeTypes(data);
    } catch (err: any) {
      console.error("Fetch offices failed:", err);
      setError(err.message || "Failed to load offices");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load offices",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addOfficeType = async (data: FormValues) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";
      console.log("Posting to:", `${apiUrl}/api/offices`, "Data:", data);
      const response = await fetch(`${apiUrl}/api/offices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add office");
      }

      const newOfficeType = await response.json();
      setOfficeTypes([...officeTypes, newOfficeType]);

      toast({
        title: "Office Added",
        description: `${data.name} has been added successfully.`,
      });
    } catch (err: any) {
      console.error("Add office failed:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add office",
      });
      throw err;
    }
  };

  const updateOffice = async (id: number, data: FormValues) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";
      console.log("Updating office at:", `${apiUrl}/api/offices/${id}`, "Data:", data);
      const response = await fetch(`${apiUrl}/api/offices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update office");
      }

      const updatedOffice = await response.json();
      setOfficeTypes(officeTypes.map((office) => (office.id === id ? updatedOffice : office)));

      toast({
        title: "Office Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } catch (err: any) {
      console.error("Update office failed:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update office",
      });
      throw err;
    }
  };

  const deleteOffice = async (id: number) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";
      console.log("Deleting office at:", `${apiUrl}/api/offices/${id}`);
      const response = await fetch(`${apiUrl}/api/offices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete office");
      }

      setOfficeTypes(officeTypes.filter((office) => office.id !== id));

      toast({
        title: "Office Deleted",
        description: "Office has been deleted successfully.",
      });
    } catch (err: any) {
      console.error("Delete office failed:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete office",
      });
      throw err;
    }
  };

  useEffect(() => {
    if (location.pathname === "/office-types" || location.pathname === "/users") {
      getOfficeTypes();
    }
  }, [location.pathname]);

  return (
    <OfficeTypesContext.Provider
      value={{
        officeTypes,
        isLoading,
        error,
        getOfficeTypes,
        addOfficeType,
        updateOffice,
        deleteOffice,
      }}
    >
      {children}
    </OfficeTypesContext.Provider>
  );
};
