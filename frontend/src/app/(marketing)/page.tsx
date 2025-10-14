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
                                <span>La plateforme de santé la plus adoptée</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                                Votre dossier médical
                                <span className="block mt-2">Centralisé et Sécurisé</span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
                                Gérez tous vos documents médicaux en un seul endroit. Analyses, scanners, ordonnances et comptes rendus accessibles à tout moment. Partagez vos informations de santé en toute sécurité avec vos médecins.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/patient/dashboard">
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 text-base rounded-full bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        <Activity className="w-5 h-5 mr-2" />
                                        Commencer
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 px-8 text-base rounded-full bg-transparent"
                                    >
                                        En savoir plus
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
                                    <p className="text-sm font-semibold">Noté 5/5 et approuvé par</p>
                                    <p className="text-2xl font-bold">1000+ Patients</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Floating Cards */}
                        <div className="relative h-[600px] hidden lg:block">
                            {/* Main Image Placeholder */}
                            <Image
                                src="/images/doctor.jpg"
                                alt="Illustration Médecin"
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
                                                src={`/images/Doctor-${i}.png`}
                                                alt={`Médecin ${i}`}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full border-2 border-background object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">300+</p>
                                        <p className="text-xs text-muted-foreground">Médecins experts</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Floating Card 2 - Bottom Left */}
                            <Card className="absolute bottom-20 left-0 p-4 glass-effect border-border/50 shadow-xl animate-float-delayed">
                                <div className="space-y-2">
                                    <Image
                                        src="/images/medical-record1.png"
                                        alt="Dossier médical"
                                        width={128}
                                        height={96}
                                        className="rounded-lg object-cover"
                                    />

                                    <p className="text-lg font-semibold">5 000+</p>
                                    <p className="text-xs text-muted-foreground">Dossiers gérés</p>
                                </div>
                            </Card>

                            {/* Floating Card 3 - Middle Right */}
                            <Card className="absolute top-1/2 right-12 p-3 glass-effect border-border/50 shadow-xl">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-secondary" />
                                    <span className="text-sm font-medium">Résultats Certifiés</span>
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
                            Gestion Complète de Votre Santé
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                            Tout ce dont vous avez besoin pour gérer, partager et sécuriser vos documents médicaux sur une seule plateforme
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <QrCode className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Accès par Code QR</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Partagez vos documents médicaux de façon sécurisée via des codes QR temporaires. Vous contrôlez qui voit quoi et pour combien de temps.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold">Dossier Centralisé</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Tous vos documents médicaux en un seul endroit : analyses, scanners, radios, ordonnances et comptes rendus de tous vos établissements de santé.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold">Confidentialité Garantie</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Vos données sont chiffrées et protégées. Traçabilité complète de qui a accédé à vos documents et quand.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-chart-3/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-chart-3" />
                            </div>
                            <h3 className="text-xl font-semibold">Résultats Instantanés</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Recevez une notification dès que vos résultats d'analyses sont disponibles. Plus besoin d'attendre ou de téléphoner.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-chart-4/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-chart-4" />
                            </div>
                            <h3 className="text-xl font-semibold">Collaboration Fluide</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Connectez patients, médecins, laboratoires et hôpitaux dans un écosystème intégré pour de meilleurs soins.
                            </p>
                        </Card>

                        <Card className="p-8 space-y-4 hover:shadow-xl transition-all glass-effect border-border/50 group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-chart-5/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Activity className="w-7 h-7 text-chart-5" />
                            </div>
                            <h3 className="text-xl font-semibold">Historique Complet</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Suivez vos traitements, vaccinations, maladies chroniques et allergies pour une gestion complète de votre santé.
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
                            <span>Rejoignez 1000+ Professionnels de Santé</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                            Prêt à Transformer Votre Gestion de Santé ?
                        </h2>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                            Rejoignez des milliers de patients et professionnels de santé qui utilisent MedQR pour une gestion sécurisée et efficace des dossiers médicaux.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Link href="/patient/dashboard">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-base rounded-full bg-foreground text-background hover:bg-foreground/90"
                                >
                                    Commencer
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 px-8 text-base rounded-full bg-transparent"
                                >
                                    En savoir plus
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
                        <p className="text-sm text-muted-foreground">© 2025 MedQR. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}