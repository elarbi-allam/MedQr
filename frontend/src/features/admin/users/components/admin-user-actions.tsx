import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Eye, EllipsisVertical, Pencil, Trash2, Key } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminUserDataType } from '../types/admin-user.type';

const EditAdminUserDialog = dynamic(() => import('./edit-admin-user-dialog'));
const DeleteAdminUserDialog = dynamic(() => import('./delete-admin-user-dialog'));
const ViewAdminUserDialog = dynamic(() => import('./view-admin-user-dialog'));
const ChangeAdminUserPasswordDialog = dynamic(() => import('./change-admin-user-password-dialog'));

interface AdminUserActionsProps {
    user: AdminUserDataType;
}

export const AdminUserActions: React.FC<AdminUserActionsProps> = ({ user }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

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
                        Voir le profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChangePasswordModalOpen(true)}>
                        <Key className="mr-2 h-4 w-4" />
                        Changer le mot de passe
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

            <EditAdminUserDialog
                user={user}
                open={editModalOpen}
                setOpen={setEditModalOpen}
            />
            <DeleteAdminUserDialog
                user={user}
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
            />
            <ViewAdminUserDialog
                user={user}
                open={viewModalOpen}
                setOpen={setViewModalOpen}
            />
            <ChangeAdminUserPasswordDialog
                user={user}
                open={changePasswordModalOpen}
                setOpen={setChangePasswordModalOpen}
            />
        </div>
    );
};