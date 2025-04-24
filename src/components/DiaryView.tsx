// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2, Download, Share2, Upload } from "lucide-react";
// import { useDiaryPdfs } from "../contexts/diaryPdfsContext";
// import { toast } from "@/components/ui/use-toast";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const DiaryView = () => {
//   const { diaryPdf, isLoading, error, fetchDiaryPdf, uploadDiaryPdf } = useDiaryPdfs();
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [fileName, setFileName] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     try {
//       await uploadDiaryPdf(file, fileName || file.name);
//       setFile(null);
//       setFileName("");
//     } catch (err) {
//       console.error("Upload error:", err);
//     }
//   };

//   const handleDownload = async () => {
//     if (!diaryPdf) return;
//     try {
//       const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${apiUrl}/api/diary-pdfs/${diaryPdf.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to download PDF");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = diaryPdf.file_name || `diary_${diaryPdf.id}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to download PDF",
//       });
//     }
//   };

//   const handleShare = async () => {
//     if (!diaryPdf) return;
//     const shareUrl = `${apiUrl}/${diaryPdf.file_path}`;
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: diaryPdf.file_name,
//           url: shareUrl,
//         });
//       } catch (err) {
//         console.error("Share error:", err);
//       }
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       toast({
//         title: "Link Copied",
//         description: "PDF link copied to clipboard",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
//         <Loader2 className="h-12 w-12 text-primary animate-spin" />
//         <p className="mt-4 text-lg text-muted-foreground">Loading diary PDF...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-red-500">
//         {error}
//         <Button onClick={fetchDiaryPdf} className="mt-4">
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-card p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-6">Diary PDF</h1>
//       <div className="flex items-center space-x-2 mb-6">
//         <Input type="file" accept="application/pdf" onChange={handleFileChange} className="w-auto" />
//         <Input
//           type="text"
//           placeholder="File name (optional)"
//           value={fileName}
//           onChange={(e) => setFileName(e.target.value)}
//           className="w-48"
//         />
//         <Button onClick={handleUpload} disabled={!file}>
//           <Upload className="mr-2 h-4 w-4" /> Upload
//         </Button>
//       </div>

//       {diaryPdf ? (
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <p className="font-medium">{diaryPdf.file_name || `Diary ${diaryPdf.id}`}</p>
//             <div className="space-x-2">
//               <Button variant="outline" size="sm" onClick={handleDownload}>
//                 <Download className="h-4 w-4 mr-1" /> Download
//               </Button>
//               <Button variant="outline" size="sm" onClick={handleShare}>
//                 <Share2 className="h-4 w-4 mr-1" /> Share
//               </Button>
//             </div>
//           </div>
//           <div className="border rounded-md p-2">
//             <Document
//               file={`${apiUrl}/${diaryPdf.file_path}`}
//               onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//               className="flex justify-center"
//             >
//               <Page pageNumber={1} width={600} />
//             </Document>
//             {numPages && <p className="text-center text-sm text-muted-foreground">Page 1 of {numPages}</p>}
//           </div>
//         </div>
//       ) : (
//         <p className="text-muted-foreground">No diary PDF available. Upload one to get started.</p>
//       )}
//     </div>
//   );
// };

// export default DiaryView;

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, Share2, Upload } from "lucide-react";
import { useDiaryPdfs } from "../contexts/diaryPdfsContext";
import { toast } from "@/components/ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DiaryView = () => {
  const { diaryPdf, isLoading, error, fetchDiaryPdf, uploadDiaryPdf } = useDiaryPdfs();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadDiaryPdf(file, fileName || file.name);
      setFile(null);
      setFileName("");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDownload = async () => {
    if (!diaryPdf) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/api/diary-pdfs/${diaryPdf.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to download PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = diaryPdf.file_name || `diary_${diaryPdf.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to download PDF",
      });
    }
  };

  const handleShare = async () => {
    if (!diaryPdf) return;
    const shareUrl = `${apiUrl}/${diaryPdf.file_path}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: diaryPdf.file_name,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "PDF link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-lg text-muted-foreground">Loading diary PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
        <Button onClick={fetchDiaryPdf} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Diary PDF</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2 mb-6">
        <Input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full sm:w-auto" />
        <Input
          type="text"
          placeholder="File name (optional)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full sm:w-48"
        />
        <Button onClick={handleUpload} disabled={!file}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>

      {diaryPdf ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-medium">{diaryPdf.file_name || `Diary ${diaryPdf.id}`}</p>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </div>
          <div className="border rounded-md p-2 overflow-x-auto">
            <Document
              file={`${apiUrl}/${diaryPdf.file_path}`}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="flex justify-center"
            >
              <Page pageNumber={1} width={300} className="md:[&>canvas]:w-[450px]" />
            </Document>
            {numPages && <p className="text-center text-sm text-muted-foreground">Page 1 of {numPages}</p>}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No diary PDF available. Upload one to get started.</p>
      )}
    </div>
  );
};

export default DiaryView;
