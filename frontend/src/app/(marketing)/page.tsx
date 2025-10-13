import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Shield, Zap, QrCode, FileText, Users, ArrowRight, CheckCircle, Star } from "lucide-react";
import Image from "next/image";
export default function HomePage() {
    return (
        <div className="min-h-screen">
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(214,232,247,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(121,235,151,0.2),transparent_50%)]" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50 text-sm font-medium">
                                <Activity className="w-4 h-4 text-primary" />
                                <span>World&apos;s Most Adopted Healthcare AI</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                                Revolutionizing
                                <span className="block mt-2">Healthcare with AI</span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
                                Transform health with AI. Diagnostics, treatments, and care, innovatively designed by
                                MedQR. Explore the future of medicine. Empower healthcare professionals and patients
                                alike.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/patient/dashboard">
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 text-base rounded-full bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        <Activity className="w-5 h-5 mr-2" />
                                        Book a call
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 px-8 text-base rounded-full bg-transparent"
                                    >
                                        Appointment
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-8 pt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Image
                                            key={i}
                                            src={`/images/avatar-${i}.jpg`}
                                            alt="Patient"
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full border-2 border-background object-cover"
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Rated 5/5 & Trusted by</p>
                                    <p className="text-2xl font-bold">1000+ Patients</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Floating Cards */}
                        <div className="relative h-[600px] hidden lg:block">
                            {/* Main Image Placeholder */}
                            <Image
                                src="/images/doctor.jpg"
                                alt="Doctor Illustration"
                                width={320}
                                height={320}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl object-cover"
                            />

                            {/* Floating Card 1 - Top Right */}
                            <Card className="absolute top-12 right-0 p-4 glass-effect border-border/50 shadow-xl animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <Image
                                                key={i}
                                                src={`/images/Doctor-${i}.png`} // 🔹 Mets tes images dans /public/images/
                                                alt={`User ${i}`}
                                                width={32} // 8 * 4 = 32px
                                                height={32}
                                                className="w-8 h-8 rounded-full border-2 border-background object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">300+</p>
                                        <p className="text-xs text-muted-foreground">Expert doctors</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Floating Card 2 - Bottom Left */}
                            <Card className="absolute bottom-20 left-0 p-4 glass-effect border-border/50 shadow-xl animate-float-delayed">
                                <div className="space-y-2">
                                    <Image
                                        src="/images/medical-record1.png"
                                        alt="Medical record"
                                        width={128}
                                        height={96}
                                        className="rounded-lg object-cover"
                                    />

                                    <p className="text-lg font-semibold">5,000+</p>
                                    <p className="text-xs text-muted-foreground">Design by MedQR</p>
                                </div>
                            </Card>

                            {/* Floating Card 3 - Middle Right */}
                            <Card className="absolute top-1/2 right-12 p-3 glass-effect border-border/50 shadow-xl">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-secondary" />
                                    <span className="text-sm font-medium">Verified Results</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-balance">
                            Comprehensive Healthcare Management
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                            Everything you need to manage, share, and secure medical records in one platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <QrCode className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">QR Code Access</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Secure, temporary access to your medical records via QR codes. You control who sees what
                                and for how long.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold">Centralized Records</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                All your medical documents in one place - analyses, scans, prescriptions, and reports
                                from any healthcare provider.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold">Privacy First</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Your data is encrypted and protected. Complete audit trail of who accessed your records
                                and when.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-chart-3/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-chart-3" />
                            </div>
                            <h3 className="text-xl font-semibold">Instant Results</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Get notified immediately when lab results are ready. No more waiting or phone calls.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-chart-4/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-chart-4" />
                            </div>
                            <h3 className="text-xl font-semibold">Seamless Collaboration</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Connect patients, doctors, labs, and hospitals in one integrated ecosystem for better
                                care.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-chart-5/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Activity className="w-7 h-7 text-chart-5" />
                            </div>
                            <h3 className="text-xl font-semibold">Complete History</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Track medications, vaccinations, chronic conditions, and allergies for comprehensive
                                health management.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            <section id="about" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
                <div className="container mx-auto max-w-5xl relative z-10">
                    <Card className="p-12 md:p-16 text-center space-y-8 glass-effect border-border/50 shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Star className="w-4 h-4" />
                            <span>Join 1000+ Healthcare Professionals</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                            Ready to Transform Your Healthcare Experience?
                        </h2>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                            Join thousands of patients and healthcare providers using MedQR for secure, efficient
                            medical record management.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Link href="/patient/dashboard">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-base rounded-full bg-foreground text-background hover:bg-foreground/90"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 px-8 text-base rounded-full bg-transparent"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-4 px-6 border-t border-border/50">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Activity className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold">MedQR</span>
                        </div>
                        <p className="text-sm text-muted-foreground">© 2025 MedQR. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
