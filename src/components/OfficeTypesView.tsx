// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
// import OfficeTypeModal from "./OfficeTypeModal";
// import { useOfficeTypes } from "../contexts/officeTypesContext";

// interface FormValues {
//   name: string;
//   email: string;
//   phone_number: string;
//   address: string;
// }

// interface OfficeType {
//   id: number;
//   name: string;
//   email: string;
//   phone_number: string;
//   address: string;
// }

// const OfficeTypesView = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOffice, setEditingOffice] = useState<OfficeType | null>(null);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [officeToDelete, setOfficeToDelete] = useState<OfficeType | null>(null);
//   const { officeTypes, isLoading, error, addOfficeType, updateOffice, deleteOffice } = useOfficeTypes();

//   const handleOpenModal = (office: OfficeType | null = null) => {
//     setEditingOffice(office);
//     setIsModalOpen(true);
//   };

//   const handleAddOfficeType = async (data: FormValues) => {
//     if (editingOffice) {
//       await updateOffice(editingOffice.id, data);
//     } else {
//       await addOfficeType(data);
//     }
//     setEditingOffice(null);
//     setIsModalOpen(false);
//   };

//   const handleOpenDeleteDialog = (office: OfficeType) => {
//     setOfficeToDelete(office);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleDeleteOffice = async () => {
//     if (officeToDelete) {
//       await deleteOffice(officeToDelete.id);
//     }
//     setIsDeleteDialogOpen(false);
//     setOfficeToDelete(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
//         <Loader2 className="h-12 w-12 text-primary animate-spin" />
//         <p className="mt-4 text-lg text-muted-foreground">Loading offices...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-red-500">
//         {error}
//         <Button onClick={() => window.location.reload()} className="mt-4">
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-card p-6 rounded-lg shadow-sm border">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold">Offices</h1>
//           <p className="text-muted-foreground mt-1">Manage organization offices and locations</p>
//         </div>
//         <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90">
//           <Plus className="mr-2 h-4 w-4" /> Add Office
//         </Button>
//       </div>

//       <Table>
//         <TableCaption>List of offices in the organization</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Phone Number</TableHead>
//             <TableHead>Address</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {officeTypes.map((office) => (
//             <TableRow key={office.id}>
//               <TableCell className="font-medium">{office.name}</TableCell>
//               <TableCell>{office.email}</TableCell>
//               <TableCell>{office.phone_number}</TableCell>
//               <TableCell>{office.address}</TableCell>
//               <TableCell>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" size="sm" onClick={() => handleOpenModal(office)}>
//                     <Pencil className="h-4 w-4 mr-1" /> Edit
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="text-destructive border-destructive hover:bg-destructive hover:text-white"
//                     onClick={() => handleOpenDeleteDialog(office)}
//                   >
//                     <Trash2 className="h-4 w-4 mr-1" /> Delete
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <OfficeTypeModal
//         open={isModalOpen}
//         onOpenChange={(open) => {
//           setIsModalOpen(open);
//           if (!open) setEditingOffice(null);
//         }}
//         onSubmit={handleAddOfficeType}
//         editingOffice={editingOffice}
//       />

//       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete the office "{officeToDelete?.name}"? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setOfficeToDelete(null)}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               onClick={handleDeleteOffice}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default OfficeTypesView;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2 } from "lucide-react";
import OfficeTypeModal from "./OfficeTypeModal";
import DataTable from "@/components/ui/DataTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useOfficeTypes } from "../contexts/officeTypesContext";

interface FormValues {
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface OfficeType {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

const ITEMS_PER_PAGE = 5;

const officeColumns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone_number", header: "Phone Number" },
  { key: "address", header: "Address" },
];

const OfficeTypesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<OfficeType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState<OfficeType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { officeTypes, isLoading, error, addOfficeType, updateOffice, deleteOffice } = useOfficeTypes();

  const handleOpenModal = (office: OfficeType | null = null) => {
    setEditingOffice(office);
    setIsModalOpen(true);
  };

  const handleAddOfficeType = async (data: FormValues) => {
    if (editingOffice) {
      await updateOffice(editingOffice.id, data);
    } else {
      await addOfficeType(data);
    }
    setEditingOffice(null);
    setIsModalOpen(false);
    setCurrentPage(1); // Reset to first page after add/update
  };

  const handleOpenDeleteDialog = (office: OfficeType) => {
    setOfficeToDelete(office);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOffice = async () => {
    if (officeToDelete) {
      await deleteOffice(officeToDelete.id);
      // Adjust current page if necessary
      const totalPages = Math.ceil((officeTypes.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
    setIsDeleteDialogOpen(false);
    setOfficeToDelete(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(officeTypes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOffices = officeTypes.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-lg text-muted-foreground">Loading offices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Offices</h1>
          <p className="text-muted-foreground mt-1">Manage organization offices and locations</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Office
        </Button>
      </div>

      <DataTable
        items={paginatedOffices}
        columns={officeColumns}
        caption="List of offices in the organization"
        onEdit={handleOpenModal}
        onDelete={handleOpenDeleteDialog}
      />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <OfficeTypeModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingOffice(null);
        }}
        onSubmit={handleAddOfficeType}
        editingOffice={editingOffice}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the office "{officeToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOfficeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteOffice}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OfficeTypesView;
