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
  name: z.string().min(2, { message: "Rank name must be at least 2 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface RankType {
  id: number;
  name: string;
}

interface RankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  editingRank: RankType | null;
}

const RankModal = ({ open, onOpenChange, onSubmit, editingRank }: RankModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (editingRank) {
      form.reset({
        name: editingRank.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [editingRank, form]);

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // Toast is handled in RanksContext
    } finally {
      setIsLoading(false);
      if (!editingRank) {
        form.reset();
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingRank ? "Edit Rank" : "Add New Rank"}</DialogTitle>
          <DialogDescription>
            {editingRank ? "Update the details for this rank." : "Fill in the details to create a new rank."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Officer" {...field} />
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
                    {editingRank ? "Updating..." : "Adding..."}
                  </>
                ) : editingRank ? (
                  "Update Rank"
                ) : (
                  "Add Rank"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RankModal;
