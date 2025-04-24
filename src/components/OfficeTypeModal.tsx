import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Office name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[0-9()\-+\s]*$/, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface OfficeType {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface OfficeTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  editingOffice: OfficeType | null;
}

const OfficeTypeModal = ({ open, onOpenChange, onSubmit, editingOffice }: OfficeTypeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
    },
  });

  useEffect(() => {
    if (editingOffice) {
      form.reset({
        name: editingOffice.name,
        email: editingOffice.email,
        phone_number: editingOffice.phone_number,
        address: editingOffice.address,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone_number: "",
        address: "",
      });
    }
  }, [editingOffice, form]);

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // Toast is handled in OfficeTypesContext
    } finally {
      setIsLoading(false);
      if (!editingOffice) {
        form.reset();
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingOffice ? "Edit Office" : "Add New Office"}</DialogTitle>
          <DialogDescription>
            {editingOffice ? "Update the details for this office." : "Fill in the details to create a new office."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Headquarters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="office@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingOffice ? "Updating..." : "Adding..."}
                  </>
                ) : editingOffice ? (
                  "Update Office"
                ) : (
                  "Add Office"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OfficeTypeModal;
