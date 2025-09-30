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
import { TruckTypeDataType } from "../types/truck-type.type";

const EditAdminTruckTypeDialog = dynamic(
  () => import("./edit-admin-truck-type-dialog")
);
const DeleteAdminTruckTypeDialog = dynamic(
  () => import("./delete-admin-truck-type-dialog")
);
const ViewAdminTruckTypeDialog = dynamic(
  () => import("./view-admin-truck-type-dialog")
);

interface AdminTruckTypeActionsProps {
  truckType: TruckTypeDataType;
}

export const AdminTruckTypeActions: React.FC<AdminTruckTypeActionsProps> = ({
  truckType,
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

      <EditAdminTruckTypeDialog
        truckType={truckType}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
      <DeleteAdminTruckTypeDialog
        truckType={truckType}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <ViewAdminTruckTypeDialog
        truckType={truckType}
        open={viewModalOpen}
        setOpen={setViewModalOpen}
      />
    </div>
  );
};
