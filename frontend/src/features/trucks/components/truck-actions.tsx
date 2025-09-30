import { useState } from "react";
import dynamic from "next/dynamic";
import { Eye, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TruckDataType } from "../types/truck.type";

const EditTruckDialog = dynamic(() => import("./edit-truck-dialog"));
const DeleteTruckDialog = dynamic(() => import("./delete-truck-dialog"));
const ViewTruckDialog = dynamic(() => import("./view-truck-dialog"));

interface TruckActionsProps {
  truck: TruckDataType;
  isAdmin?: boolean;
}

export const TruckActions: React.FC<TruckActionsProps> = ({
  truck,
  isAdmin = false,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-lg">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setViewModalOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>
          {!isAdmin && (
            <>
              <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="group focus:bg-error text-error-foreground focus:text-error-foreground"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTruckDialog
        truck={truck}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
      <DeleteTruckDialog
        truck={truck}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <ViewTruckDialog
        truck={truck}
        open={viewModalOpen}
        setOpen={setViewModalOpen}
      />
    </div>
  );
};
