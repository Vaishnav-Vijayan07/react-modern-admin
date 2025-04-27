import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router";

interface Rank {
  id: number;
  name: string;
}

interface FormValues {
  name: string;
}

interface RanksContextType {
  ranks: Rank[];
  isLoading: boolean;
  error: string | null;
  addRank: (data: FormValues) => Promise<void>;
  updateRank: (id: number, data: FormValues) => Promise<void>;
  deleteRank: (id: number) => Promise<void>;
}

const RanksContext = createContext<RanksContextType | undefined>(undefined);

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const RanksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchRanks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/ranks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ranks");
      }

      const data = await response.json();
      setRanks(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch ranks",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRank = async (data: FormValues) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/ranks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add rank");
      }

      const newRank = await response.json();
      setRanks((prev) => [...prev, newRank]);
      toast({
        title: "Success",
        description: "Rank added successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add rank",
      });
      throw err;
    }
  };

  const updateRank = async (id: number, data: FormValues) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/ranks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update rank");
      }

      const updatedRank = await response.json();
      setRanks((prev) => prev.map((rank) => (rank.id === id ? updatedRank : rank)));
      toast({
        title: "Success",
        description: "Rank updated successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update rank",
      });
      throw err;
    }
  };

  const deleteRank = async (id: number) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/ranks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete rank");
      }

      setRanks((prev) => prev.filter((rank) => rank.id !== id));
      toast({
        title: "Success",
        description: "Rank deleted successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete rank",
      });
      throw err;
    }
  };

  useEffect(() => {
    if (location.pathname === "/ranks") {
      fetchRanks();
    }
  }, []);

  return (
    <RanksContext.Provider value={{ ranks, isLoading, error, addRank, updateRank, deleteRank }}>{children}</RanksContext.Provider>
  );
};

export const useRanks = () => {
  const context = useContext(RanksContext);
  if (!context) {
    throw new Error("useRanks must be used within a RanksProvider");
  }
  return context;
};
