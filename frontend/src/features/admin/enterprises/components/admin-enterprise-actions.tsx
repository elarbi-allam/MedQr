import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Eye, EllipsisVertical, Trash2, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnterpriseDataType } from "../types/enterprise.type";

const DeleteAdminEnterpriseDialog = dynamic(
  () => import("./delete-admin-enterprise-dialog")
);
const ChangeEnterpriseStatusDialog = dynamic(
  () => import("./change-enterprise-status-dialog")
);

interface AdminEnterpriseActionsProps {
  enterprise: EnterpriseDataType;
}

export const AdminEnterpriseActions: React.FC<AdminEnterpriseActionsProps> = ({
  enterprise,
}) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleViewDetails = () => {
    router.push(`/admin/enterprises/${enterprise.id}`);
  };

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56"
          side="left"
          sideOffset={5}
          alignOffset={-5}
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleViewDetails}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStatusModalOpen(true)}
            className="cursor-pointer"
          >
            <Shield className="mr-2 h-4 w-4" />
            Changer le statut
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="group focus:text-destructive-foreground text-destructive cursor-pointer"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="group text-destructive mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAdminEnterpriseDialog
        enterprise={enterprise}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <ChangeEnterpriseStatusDialog
        enterprise={enterprise}
        open={statusModalOpen}
        setOpen={setStatusModalOpen}
      />
    </div>
  );
};
