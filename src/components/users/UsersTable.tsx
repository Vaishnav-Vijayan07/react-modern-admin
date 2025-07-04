import React, { useState, useMemo } from "react";
import { Loader2, Plus, Pencil, Trash2, Key } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import UserModal from "./UserModal";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/contexts/UsersContext";

interface Office {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  rank_id: string;
  blood_group: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  service_start_date: string;
  residential_address: string;
  office_id: number;
  is_active?: boolean;
  login_id?: string;
  full_name: string;
  last_donated_date?: string | null;
  profile_photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  Office?: Office;
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

const ITEMS_PER_PAGE = 5;
const apiUrl = import.meta.env.VITE_API_URL;

const UsersView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const { users, isLoading, error, addUser, updateUser, deleteUser } = useUsers();

  const columns: any = useMemo(
    () => [
      {
        header: "Full Name",
        accessorKey: "full_name",
        cell: ({ row }) => <span className="font-medium">{row.original.full_name || "N/A"}</span>,
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Login ID",
        accessorKey: "login_id",
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Blood Group",
        accessorKey: "blood_group",
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Rank",
        accessorKey: "rank_name",
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Office",
        accessorKey: "office_name",
        cell: ({ row }) => row.original.office_name || "N/A",
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Last Donated Date",
        accessorKey: "last_donated_date",
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Status",
        accessorKey: "is_active",
        cell: ({ row }) => (
          <Badge
            variant={row.original.is_active == "true" ? "default" : "outline"}
            className={
              row.original.is_active == "true" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600 text-white"
            }
          >
            {row.original.is_active == "true" ? "Active" : "Disabled"}
          </Badge>
        ),
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEditClick(row.original)}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
              onClick={() => handleOpenDeleteDialog(row.original)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => handleOpenResetDialog(row.original)}
              disabled={isResetting}
            >
              {isResetting && userToReset?.id === row.original.id ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Key className="h-4 w-4 mr-1" />
              )}
              Reset Password
            </Button>
          </div>
        ),
      },
    ],
    [isResetting, userToReset]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: ITEMS_PER_PAGE,
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleAddClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAddUser = async (data: FormValues) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          ...data,
          is_active: data.is_active,
        });
      } else {
        await addUser(data);
      }
      setEditingUser(null);
      setIsModalOpen(false);
      table.setPageIndex(0);
    } catch (err) {
      console.error("Error adding/updating user:", err);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      table.setPageIndex(0);
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleOpenResetDialog = (user: User) => {
    setUserToReset(user);
    setIsResetDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (!userToReset) return;

    setIsResetting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userToReset.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      alert(data.message); // Simple feedback; consider using a toast notification
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password: " + error.message);
    } finally {
      setIsResetting(false);
      setIsResetDialogOpen(false);
      setUserToReset(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-lg text-muted-foreground">Loading users...</p>
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
    <div className="bg-background w-full">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Users</CardTitle>
            <Button onClick={handleAddClick} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead>Sl. No</TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      <div className="flex items-center cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <span className="ml-2">↑</span>,
                          desc: <span className="ml-2">↓</span>,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
        </CardContent>
      </Card>

      <UserModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingUser(null);
        }}
        onSubmit={handleAddUser}
        editingUser={editingUser}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the user "{userToDelete?.full_name || userToDelete?.rank_id}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Password Reset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the password for user "{userToReset?.full_name || userToReset?.rank_id}"? A new
              password will be generated and sent to their email ({userToReset?.email || "N/A"}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToReset(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleResetPassword}>
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersView;

// import React, { useState, useMemo } from "react";
// import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
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
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge"; // ⭐ Make sure you import Badge
// import UserModal from "./UserModal";
// import {
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Input } from "@/components/ui/input";
// import { useUsers } from "@/contexts/UsersContext";

// interface Office {
//   id: number;
//   name: string;
//   email: string;
//   phone_number: string;
//   address: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface User {
//   id: number;
//   rank_id: string;
//   blood_group: string;
//   mobile_number: string;
//   email: string;
//   date_of_birth: string;
//   service_start_date: string;
//   residential_address: string;
//   office_id: number;
//   is_active?: boolean;
//   login_id?: string;
//   full_name: string;
//   last_donated_date?: string | null;
//   profile_photo?: string | null;
//   createdAt?: string;
//   updatedAt?: string;
//   Office?: Office;
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
//   is_active: boolean;
// }

// const ITEMS_PER_PAGE = 5;

// const UsersView = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);
//   const [globalFilter, setGlobalFilter] = useState("");

//   const { users, isLoading, error, addUser, updateUser, deleteUser } = useUsers();

//   const columns: any = useMemo(
//     () => [
//       {
//         header: "Full Name",
//         accessorKey: "full_name",
//         cell: ({ row }) => <span className="font-medium">{row.original.full_name || "N/A"}</span>,
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Login ID",
//         accessorKey: "login_id",
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Email",
//         accessorKey: "email",
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Blood Group",
//         accessorKey: "blood_group",
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Rank",
//         accessorKey: "rank_name",
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Office",
//         accessorKey: "office_name",
//         cell: ({ row }) => row.original.office_name || "N/A",
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Last Donated Date",
//         accessorKey: "last_donated_date",
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Status",
//         accessorKey: "is_active",
//         cell: ({ row }) => (
//           <Badge
//             variant={row.original.is_active == "true" ? "default" : "outline"}
//             className={
//               row.original.is_active == "true" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600 text-white"
//             }
//           >
//             {row.original.is_active == "true" ? "Active" : "Disabled"}
//           </Badge>
//         ),
//         enableSorting: true,
//         enableGlobalFilter: true,
//       },
//       {
//         header: "Actions",
//         id: "actions",
//         cell: ({ row }) => (
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm" onClick={() => handleEditClick(row.original)}>
//               <Pencil className="h-4 w-4 mr-1" /> Edit
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className="text-destructive border-destructive hover:bg-destructive hover:text-white"
//               onClick={() => handleOpenDeleteDialog(row.original)}
//             >
//               <Trash2 className="h-4 w-4 mr-1" /> Delete
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: users,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: {
//       pagination: {
//         pageSize: ITEMS_PER_PAGE,
//       },
//     },
//     state: {
//       globalFilter,
//     },
//     onGlobalFilterChange: setGlobalFilter,
//   });

//   const handleAddClick = () => {
//     setEditingUser(null);
//     setIsModalOpen(true);
//   };

//   const handleEditClick = (user: User) => {
//     setEditingUser(user);
//     setIsModalOpen(true);
//   };

//   const handleAddUser = async (data: FormValues) => {
//     try {
//       if (editingUser) {
//         await updateUser(editingUser.id, {
//           ...data,
//           is_active: data.is_active,
//         });
//       } else {
//         await addUser(data);
//       }
//       setEditingUser(null);
//       setIsModalOpen(false);
//       table.setPageIndex(0);
//     } catch (err) {
//       console.error("Error adding/updating user:", err);
//     }
//   };

//   const handleOpenDeleteDialog = (user: User) => {
//     setUserToDelete(user);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleDeleteUser = async () => {
//     if (userToDelete) {
//       await deleteUser(userToDelete.id);
//       table.setPageIndex(0);
//     }
//     setIsDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
//         <Loader2 className="h-12 w-12 text-primary animate-spin" />
//         <p className="mt-4 text-lg text-muted-foreground">Loading users...</p>
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
//     <div className="bg-background w-full">
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Users</CardTitle>
//             <Button onClick={handleAddClick} className="bg-primary hover:bg-primary/90">
//               <Plus className="mr-2 h-4 w-4" /> Add User
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-4">
//             <Input
//               placeholder="Search all columns..."
//               value={globalFilter}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className="max-w-sm"
//             />
//           </div>

//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   <TableHead>Sl. No</TableHead>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       <div className="flex items-center cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                         {{
//                           asc: <span className="ml-2">↑</span>,
//                           desc: <span className="ml-2">↓</span>,
//                         }[header.column.getIsSorted() as string] ?? null}
//                       </div>
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows.map((row, index) => (
//                 <TableRow key={row.id}>
//                   <TableCell>{index + 1}</TableCell>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <div className="flex items-center justify-between mt-4">
//             <div className="flex space-x-2">
//               <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
//                 Previous
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//                 Next
//               </Button>
//             </div>
//             <span>
//               Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <UserModal
//         open={isModalOpen}
//         onOpenChange={(open) => {
//           setIsModalOpen(open);
//           if (!open) setEditingUser(null);
//         }}
//         onSubmit={handleAddUser}
//         editingUser={editingUser}
//       />

//       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete the user "{userToDelete?.full_name || userToDelete?.rank_id}"? This action cannot be
//               undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               onClick={handleDeleteUser}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default UsersView;
