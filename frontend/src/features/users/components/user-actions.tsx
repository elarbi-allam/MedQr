import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, EllipsisVertical, Pencil, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STATUS_OPTIONS, UserDataType } from '../types/user.type';

const EditUserDialog = dynamic(() => import('./edit-user-dialog'));
const ChangeStatusDialog = dynamic(() => import('./change-status-dialog'));
const DeleteUserDialog = dynamic(() => import('./delete-user-dialog'));

interface UserActionsProps {
    user: UserDataType;
}

export const UserActions: React.FC<UserActionsProps> = ({ user }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
    const [status, setStatus] = useState(user.status);

    return (
        <div className="flex items-center justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-lg">
                        <EllipsisVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                        <Pencil className="size-4" />
                        <span>Modifier</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status !== STATUS_OPTIONS.Values.active && (
                        <DropdownMenuItem
                            className="group focus:bg-success focus:text-success-foreground"
                            onClick={() => {
                                setChangeStatusModalOpen(true);
                                setStatus(STATUS_OPTIONS.Values.active);
                            }}
                        >
                            <Check className="size-4 group-focus:text-success-foreground" />
                            <span>Activer</span>
                        </DropdownMenuItem>
                    )}
                    {user.status !== STATUS_OPTIONS.Values.archive && (
                        <DropdownMenuItem
                            className="group focus:bg-error focus:text-error-foreground"
                            onClick={() => {
                                setChangeStatusModalOpen(true);
                                setStatus(STATUS_OPTIONS.Values.archive);
                            }}
                        >
                            <X className="size-4 group-focus:text-error-foreground" />
                            <span>Suspendre</span>
                        </DropdownMenuItem>
                    )}
                    {user.status !== STATUS_OPTIONS.Values.inActive && (
                        <DropdownMenuItem
                            className="group focus:bg-warning focus:text-warning-foreground"
                            onClick={() => {
                                setChangeStatusModalOpen(true);
                                setStatus(STATUS_OPTIONS.Values.inActive);
                            }}
                        >
                            <X className="size-4 group-focus:text-warning-foreground" />
                            <span>Désactiver</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="group focus:bg-error text-error-foreground focus:text-error-foreground"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        <Trash2 className="size-4 group-focus:text-error-foreground" />
                        <span>Supprimer</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditUserDialog
                user={user}
                open={editModalOpen}
                setOpen={setEditModalOpen}
            />
            <ChangeStatusDialog
                user={user}
                status={status}
                open={changeStatusModalOpen}
                setOpen={setChangeStatusModalOpen}
            />
            <DeleteUserDialog
                user={user}
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
            />
        </div>
    );
};
