'use client';

import React, { useState } from 'react';
import { BellIcon, Loader2 } from 'lucide-react';

import ChangePasswordDialog from '@/features/users/components/change-password-dialog';
import {
    useGetCurrentUserInfo,
    useGetPasswordResetRequest,
} from '@/features/users/hooks/use-user';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Notification() {
    const [changePasswordModalOpen, setChangePasswordModalOpen] =
        useState(false);
    const { data: passwordResetRequest, isLoading } =
        useGetPasswordResetRequest();
    const { data: currentUserInfo } = useGetCurrentUserInfo();

    if (currentUserInfo?.data?.role !== 'admin') {
        return null;
    }

    if (isLoading) {
        return (
            <Button
                variant="ghost"
                className="size-10 justify-center gap-2 transition-all rounded-lg duration-300 hover:bg-brand/10 hover:text-brand border hover:border-brand relative"
            >
                <Loader2 className="size-4 animate-spin" />
            </Button>
        );
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="size-10 justify-center gap-2 transition-all rounded-lg duration-300 hover:bg-brand/10 hover:text-brand border hover:border-brand relative"
                    >
                        <BellIcon className="size-4" />
                        {/* badge */}
                        {passwordResetRequest &&
                        passwordResetRequest?.data?.length &&
                        passwordResetRequest?.data?.length > 0 ? (
                            <span className="absolute -top-0.5 -right-0.5 size-2 text-xs rounded-md bg-brand">
                                <span className="size-full bg-warning-foreground rounded-full" />
                            </span>
                        ) : null}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-64">
                    <DropdownMenuLabel className="flex items-center justify-between">
                        <span className="text-sm">Notifications</span>
                        <span className="text-sm text-muted-foreground px-2 py-1 rounded-md bg-muted">
                            {passwordResetRequest?.data?.length ?? 0}
                        </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {passwordResetRequest?.data?.length &&
                    passwordResetRequest?.data?.length > 0 ? (
                        passwordResetRequest?.data?.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                className="cursor-pointer"
                                onClick={() => setChangePasswordModalOpen(true)}
                            >
                                <span className="text-sm">
                                    utilisateur{' '}
                                    <span className="font-bold">
                                        {item.user.firstName}{' '}
                                        {item.user.lastName}
                                    </span>{' '}
                                    a demandé un changement de mot de passe
                                </span>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem>
                            <span className="text-sm">No notifications</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* change password dialog */}
            <ChangePasswordDialog
                user={
                    passwordResetRequest?.data?.[0]?.user || {
                        id: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                    }
                }
                open={changePasswordModalOpen}
                setOpen={setChangePasswordModalOpen}
                requestId={passwordResetRequest?.data?.[0]?.id || ''}
            />
        </>
    );
}
