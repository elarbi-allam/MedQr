import { useState } from "react";
import dynamic from "next/dynamic";
import { Eye, EllipsisVertical, Download, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentDataType } from "../../types/document.type";
import { useDownloadDocument, useViewDocument } from "../../hooks/use-document";

const ViewDocumentDetailsDialog = dynamic(
  () => import("./view-document-details-dialog")
);
const UpdateDocumentStatusDialog = dynamic(
  () => import("./update-document-status-dialog")
);

interface DocumentActionsProps {
  document: DocumentDataType;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
}) => {
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);

  const { mutate: downloadDocument, isPending: isDownloading } =
    useDownloadDocument();
  const { mutate: viewDocument, isPending: isViewing } = useViewDocument();

  const handleDownload = () => {
    downloadDocument(document.id);
  };

  const handleView = () => {
    viewDocument(document.id);
  };

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
          <DropdownMenuItem onClick={handleView} disabled={isViewing}>
            <Eye className="mr-2 h-4 w-4" />
            {isViewing ? "Ouverture..." : "Voir le document"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Téléchargement..." : "Télécharger"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setViewDetailsModalOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpdateStatusModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier le statut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDocumentDetailsDialog
        document={document}
        open={viewDetailsModalOpen}
        setOpen={setViewDetailsModalOpen}
      />
      <UpdateDocumentStatusDialog
        document={document}
        open={updateStatusModalOpen}
        setOpen={setUpdateStatusModalOpen}
      />
    </div>
  );
};
