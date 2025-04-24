import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: number;
  rank: string;
  blood_group: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  service_start_date: string;
  residential_address: string;
  office_id: number;
  status?: "active" | "inactive" | "pending";
  login_id?: string;
  full_name: string;
  last_donated_date?: string | null;
  profile_photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface FormValues {
  full_name: string;
  rank: string;
  blood_group: string;
  mobile_number: string;
  email: string;
  password?: string;
  date_of_birth: string;
  service_start_date: string;
  residential_address: string;
  office_id: number;
  status: "active" | "inactive" | "pending";
}

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  editingUser: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ open, onOpenChange, onSubmit, editingUser }) => {
  console.log("editingUser?.service_start_date ", editingUser?.service_start_date?.split("T")[0]);

  const form = useForm<FormValues>({
    defaultValues: {
      full_name: editingUser?.full_name || "",
      rank: editingUser?.rank || "",
      blood_group: editingUser?.blood_group || "",
      mobile_number: editingUser?.mobile_number || "",
      email: editingUser?.email || "",
      password: "",
      date_of_birth: editingUser?.date_of_birth ? new Date(editingUser.date_of_birth).toISOString().split("T")[0] : "",
      service_start_date: editingUser?.service_start_date
        ? new Date(editingUser.service_start_date).toISOString().split("T")[0]
        : "",
      residential_address: editingUser?.residential_address || "",
      office_id: editingUser?.office_id || 1,
      status: editingUser?.status || "active",
    },
  });

  useEffect(() => {
    if (editingUser) {
      form.reset({
        full_name: editingUser.full_name || "",
        rank: editingUser.rank || "",
        blood_group: editingUser.blood_group || "",
        mobile_number: editingUser.mobile_number || "",
        email: editingUser.email || "",
        password: "",
        date_of_birth: editingUser.date_of_birth ? new Date(editingUser.date_of_birth).toISOString().split("T")[0] : "",
        service_start_date: editingUser.service_start_date
          ? new Date(editingUser.service_start_date).toISOString().split("T")[0]
          : "",
        residential_address: editingUser.residential_address || "",
        office_id: editingUser.office_id || 1,
        status: editingUser.status || "active",
      });
    } else {
      form.reset({
        full_name: "",
        rank: "",
        blood_group: "",
        mobile_number: "",
        email: "",
        password: "",
        date_of_birth: "",
        service_start_date: "",
        residential_address: "",
        office_id: 1,
        status: "active",
      });
    }
  }, [editingUser, form]);

  const handleSubmit = async (data: FormValues) => {
    try {
      // Remove password if empty for updates
      if (editingUser && !data.password) {
        delete data.password;
      }
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      // Error toast is handled in context
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Type full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="rank"
                  rules={{ required: "Rank is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rank</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Officer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="blood_group"
                  rules={{ required: "Blood group is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="mobile_number"
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 9876543210" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., user@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                {!editingUser && (
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{ required: "Password is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} placeholder="Password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  rules={{ required: "Date of birth is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="service_start_date"
                  rules={{ required: "Service start date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="residential_address"
                  rules={{ required: "Residential address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 456 Elm St" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="office_id"
                  rules={{ required: "Office ID is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="e.g., 1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => [onOpenChange(false), form.reset()]}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
