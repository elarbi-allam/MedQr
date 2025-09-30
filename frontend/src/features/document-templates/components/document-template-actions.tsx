import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Eye, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DocumentTemplateDataType } from '../types/document-template.type';

const EditDocumentTemplateDialog = dynamic(() => import('./edit-document-template-dialog'));
const DeleteDocumentTemplateDialog = dynamic(() => import('./delete-document-template-dialog'));
const ViewDocumentTemplateDialog = dynamic(() => import('./view-document-template-dialog'));

interface DocumentTemplateActionsProps {
  template: DocumentTemplateDataType;
}

export const DocumentTemplateActions: React.FC<DocumentTemplateActionsProps> = ({ template }) => {
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

      <EditDocumentTemplateDialog
        template={template}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
      <DeleteDocumentTemplateDialog
        template={template}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <ViewDocumentTemplateDialog
        template={template}
        open={viewModalOpen}
        setOpen={setViewModalOpen}
      />
    </div>
  );
};