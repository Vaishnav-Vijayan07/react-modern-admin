import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  items: T[];
  columns: Column<T>[];
  caption?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

const DataTable = <T extends { id: number | string }>({
  items,
  columns,
  caption = "List of items",
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          {/* Sl. No Header */}
          <TableHead>Sl. No</TableHead>

          {/* Dynamic Headers */}
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.header}</TableHead>
          ))}
          {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item, index) => (
          <TableRow key={item.id}>
            {/* Sl. No Cell */}
            <TableCell>{index + 1}</TableCell>

            {/* Dynamic Cells */}
            {columns?.map((column) => (
              <TableCell key={String(column.key)} className={column.key === "name" ? "font-medium" : ""}>
                {column.render ? column.render(item) : String(item[column.key as keyof T] ?? "")}
              </TableCell>
            ))}

            {/* Actions */}
            {(onEdit || onDelete) && (
              <TableCell>
                <div className="flex space-x-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
