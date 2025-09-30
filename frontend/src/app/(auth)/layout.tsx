import AuthHeader from '@/features/auth/components/auth-header';

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthHeader />
            {children}
        </>
    );
}
