import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import OfficeTypeModal from "./OfficeTypeModal";
import { useToast } from "@/components/ui/use-toast";

// Mock data for initial display
const initialOfficeTypes = [
  {
    id: 1,
    name: "Headquarters",
    email: "hq@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: 2,
    name: "Regional Office",
    email: "regional@example.com",
    phone: "(555) 987-6543",
    address: "456 Park Ave, Chicago, IL 60601",
  },
  {
    id: 3,
    name: "Branch Office",
    email: "branch@example.com",
    phone: "(555) 456-7890",
    address: "789 Oak St, San Francisco, CA 94103",
  },
];

interface OfficeType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const OfficeTypesView = () => {
  const [officeTypes, setOfficeTypes] =
    useState<OfficeType[]>(initialOfficeTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleAddOfficeType = (data: FormValues) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(...officeTypes.map((office) => office.id)) + 1;

    // Create the new office type object
    const newOfficeType: OfficeType = {
      id: newId,
      ...data,
    };

    // Add to the list
    setOfficeTypes([...officeTypes, newOfficeType]);

    // Show success toast
    toast({
      title: "Office Type Added",
      description: `${data.name} has been added successfully.`,
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Office Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage organization office types and locations
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Office Type
        </Button>
      </div>

      <Table>
        <TableCaption>List of office types in the organization</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officeTypes.map((office) => (
            <TableRow key={office.id}>
              <TableCell className="font-medium">{office.name}</TableCell>
              <TableCell>{office.email}</TableCell>
              <TableCell>{office.phone}</TableCell>
              <TableCell>{office.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OfficeTypeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddOfficeType}
      />
    </div>
  );
};

export default OfficeTypesView;
