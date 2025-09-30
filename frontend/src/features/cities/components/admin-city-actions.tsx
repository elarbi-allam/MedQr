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
import { CityDataType } from "../types/city.type";

const EditAdminCityDialog = dynamic(() => import("./edit-admin-city-dialog"));
const DeleteAdminCityDialog = dynamic(
  () => import("./delete-admin-city-dialog")
);
const ViewAdminCityDialog = dynamic(() => import("./view-admin-city-dialog"));

interface AdminCityActionsProps {
  city: CityDataType;
}

export const AdminCityActions: React.FC<AdminCityActionsProps> = ({ city }) => {
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
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAdminCityDialog
        city={city}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
      <DeleteAdminCityDialog
        city={city}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <ViewAdminCityDialog
        city={city}
        open={viewModalOpen}
        setOpen={setViewModalOpen}
      />
    </div>
  );
};
