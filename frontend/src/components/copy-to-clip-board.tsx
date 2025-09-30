import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function CopyToClipboard({ text }: { text: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        toast.success('Copied to clipboard', {
            description: text,
        });
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    return (
        <div className="flex items-center gap-1" onClick={handleCopy}>
            {isCopied ? (
                <Check className="hidden h-3 w-3 cursor-pointer text-success transition-all duration-300 group-hover:block" />
            ) : (
                <Copy className="hidden h-3 w-3 cursor-pointer transition-all duration-300 group-hover:block" />
            )}
        </div>
    );
}
