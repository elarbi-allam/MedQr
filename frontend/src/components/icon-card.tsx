import { cn } from '@/lib/utils';
import React from 'react';

interface IconCardProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: React.ElementType;
}

export default function IconCard({ icon, className, ...props }: IconCardProps) {
    return (
        <div
            className={cn(
                'p-(--card-padding) rounded-(--card-radius) flex items-center justify-center size-12 backdrop-blur-sm bg-background [--card-padding:--spacing(.5)] [--card-radius:var(--radius-md)] shadow-md',
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-center w-full h-full bg-muted-background rounded-[calc(var(--card-radius)-var(--card-padding))]">
                {React.createElement(icon, {
                    className: 'size-6 text-brand-2',
                })}
            </div>
        </div>
    );
}
