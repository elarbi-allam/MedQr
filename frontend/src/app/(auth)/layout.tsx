import AuthNavbar from '@/features/auth/components/auth-header';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <AuthNavbar />
            <main className="flex-1 flex items-start justify-center pt-8 pb-16 px-4">
                {children}
            </main>
        </div>
    );
}