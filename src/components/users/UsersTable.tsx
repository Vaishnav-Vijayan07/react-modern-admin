import React, { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
}

interface UsersTableProps {
  users?: User[];
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2023-06-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Editor",
    status: "active",
    lastActive: "2023-06-14",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Viewer",
    status: "inactive",
    lastActive: "2023-05-20",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Editor",
    status: "active",
    lastActive: "2023-06-12",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Viewer",
    status: "pending",
    lastActive: "2023-06-10",
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    role: "Editor",
    status: "active",
    lastActive: "2023-06-13",
  },
  {
    id: "7",
    name: "David Miller",
    email: "david.miller@example.com",
    role: "Admin",
    status: "inactive",
    lastActive: "2023-05-25",
  },
];

const UsersTable: React.FC<UsersTableProps> = ({ users = mockUsers }) => {
  const [sortedUsers, setSortedUsers] = useState<User[]>(users);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    const sorted = [...sortedUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedUsers(sorted);
    setSortConfig({ key, direction });
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="bg-background w-full">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("name")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("email")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("role")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("lastActive")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    Last Active
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                          Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View user</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTable;
