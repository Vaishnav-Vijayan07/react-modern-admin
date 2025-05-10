import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router";

interface DiaryPdf {
  id: number;
  file_path: string;
  file_name: string;
  uploaded_at: string;
}

interface DiaryPdfsContextType {
  diaryPdf: DiaryPdf | null;
  isLoading: boolean;
  error: string | null;
  fetchDiaryPdf: () => Promise<void>;
  uploadDiaryPdf: (file: File, fileName?: string) => Promise<void>;
}

const DiaryPdfsContext = createContext<DiaryPdfsContextType | undefined>(undefined);

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7700";

export const DiaryPdfsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [diaryPdf, setDiaryPdf] = useState<DiaryPdf | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchDiaryPdf = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/diary-pdfs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch diary PDF");
      }

      const { data } = await response.json();
      console.log("Fetched diary PDF data:", data);

      setDiaryPdf(data[0] || null); // Take the first PDF (at most one)
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch diary PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDiaryPdf = async (file: File, fileName?: string) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("diary_pdf", file);
      if (fileName) formData.append("file_name", fileName);

      const response = await fetch(`${apiUrl}/api/diary-pdfs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload diary PDF");
      }

      const { data } = await response.json();
      setDiaryPdf(data);
      toast({
        title: "Success",
        description: "Diary PDF uploaded successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to upload diary PDF",
      });
      throw err;
    }
  };

  useEffect(() => {
    if (location.pathname == "/diary") {
      fetchDiaryPdf();
    }
  }, [location.pathname]);

  return (
    <DiaryPdfsContext.Provider value={{ diaryPdf, isLoading, error, fetchDiaryPdf, uploadDiaryPdf }}>
      {children}
    </DiaryPdfsContext.Provider>
  );
};

export const useDiaryPdfs = () => {
  const context = useContext(DiaryPdfsContext);
  if (!context) {
    throw new Error("useDiaryPdfs must be used within a DiaryPdfsProvider");
  }
  return context;
};
