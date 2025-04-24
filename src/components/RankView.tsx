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
import RankModal from "./RankModal";
import DataTable from "@/components/ui/DataTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useRanks } from "../contexts/RanksContext";

interface FormValues {
  name: string;
}

interface RankType {
  id: number;
  name: string;
}

const ITEMS_PER_PAGE = 5;

const rankColumns = [{ key: "name", header: "Rank Name" }];

const RanksView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<RankType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rankToDelete, setRankToDelete] = useState<RankType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { ranks, isLoading, error, addRank, updateRank, deleteRank } = useRanks();

  const handleOpenModal = (rank: RankType | null = null) => {
    setEditingRank(rank);
    setIsModalOpen(true);
  };

  const handleAddRank = async (data: FormValues) => {
    if (editingRank) {
      await updateRank(editingRank.id, data);
    } else {
      await addRank(data);
    }
    setEditingRank(null);
    setIsModalOpen(false);
    setCurrentPage(1); // Reset to first page after add/update
  };

  const handleOpenDeleteDialog = (rank: RankType) => {
    setRankToDelete(rank);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRank = async () => {
    if (rankToDelete) {
      await deleteRank(rankToDelete.id);
      // Adjust current page if necessary
      const totalPages = Math.ceil((ranks.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
    setIsDeleteDialogOpen(false);
    setRankToDelete(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(ranks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRanks = ranks.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-lg text-muted-foreground">Loading ranks...</p>
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
          <h1 className="text-2xl font-semibold">Ranks</h1>
          <p className="text-muted-foreground mt-1">Manage organization ranks and designations</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Rank
        </Button>
      </div>

      <DataTable
        items={paginatedRanks}
        columns={rankColumns}
        caption="List of ranks in the organization"
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

      <RankModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingRank(null);
        }}
        onSubmit={handleAddRank}
        editingRank={editingRank}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the rank "{rankToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRankToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteRank}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RanksView;
