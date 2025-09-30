"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/ui/navbar";
import {
  Truck,
  Building2,
  Shield,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Zap,
  Target,
  Globe,
  Star,
  ArrowUpRight,
  MapPin,
  Handshake,
  Leaf,
  Play,
  Package,
  Route,
  Gauge,
} from "lucide-react";

export default function HomePage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Optimisation Intelligente",
      description:
        "Notre moteur de matching maximise le taux de remplissage des camions et réduit les trajets à vide.",
      gradient: "from-brand to-primary",
    },
    {
      icon: Handshake,
      title: "Bidding Réversible",
      description:
        "Innovation unique : expéditeurs et transporteurs peuvent tous les deux lancer des enchères.",
      gradient: "from-primary to-accent",
    },
    {
      icon: Shield,
      title: "Confiance Garantie",
      description:
        "Processus de vérification rigoureux pour tous les acteurs de la plateforme.",
      gradient: "from-success to-secondary",
    },
    {
      icon: Leaf,
      title: "Impact Écologique",
      description:
        "Réduction significative de l'empreinte carbone grâce à l'optimisation des trajets.",
      gradient: "from-secondary to-success",
    },
  ];

  const stats = [
    {
      number: "2€",
      label: "par jour d'accès",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      number: "40%",
      label: "de trajets à vide en moins",
      icon: TrendingUp,
      color: "text-brand",
    },
    {
      number: "24/7",
      label: "support client",
      icon: Clock,
      color: "text-accent",
    },
    { number: "100%", label: "vérifié", icon: Shield, color: "text-success" },
  ];

  const steps = [
    {
      step: "01",
      title: "Inscription & Vérification",
      description:
        "Créez votre compte (Expéditeur ou Transporteur) et complétez la vérification de votre entreprise.",
      icon: Users,
      color: "from-brand to-primary",
    },
    {
      step: "02",
      title: "Publication d'Offres",
      description:
        "Publiez vos offres de transport (Transporteur) ou de marchandise (Expéditeur) en quelques clics.",
      icon: Globe,
      color: "from-primary to-accent",
    },
    {
      step: "03",
      title: "Matching & Bidding",
      description:
        "Notre IA trouve les meilleures correspondances et le système de bidding réversible facilite la négociation.",
      icon: Target,
      color: "from-accent to-success",
    },
    {
      step: "04",
      title: "Transport & Suivi",
      description:
        "Suivez vos transports en temps réel et bénéficiez d'un paiement sécurisé via votre solde interne.",
      icon: Truck,
      color: "from-success to-brand",
    },
  ];

  const testimonials = [
    {
      name: "Elarbi Allam",
      company: "Logistique Atlas",
      role: "Directeur Transport",
      content:
        "Transmarket a révolutionné notre façon de travailler. Nous avons réduit nos coûts de 30% tout en améliorant notre efficacité.",
      rating: 5,
      avatar: "EA",
    },
    {
      name: "Hajjar Chakrouni",
      company: "Transport Sahara",
      role: "CEO",
      content:
        "Le système de bidding réversible est génial ! Nos camions ne roulent plus jamais à vide.",
      rating: 5,
      avatar: "HC",
    },
    {
      name: "Moad Dahbi",
      company: "Industries Casablanca",
      role: "Responsable Logistique",
      content:
        "Plateforme intuitive et fiable. Le support client est exceptionnel.",
      rating: 5,
      avatar: "MD",
    },
  ];

  // Floating transport icons for the hero visualization
  // Adjusted positions for better distribution and less condensation
  const transportIcons = [
    { icon: Truck, position: "top-[10%] left-[15%]", delay: "0s" },
    { icon: Package, position: "top-[20%] right-[10%]", delay: "0.5s" },
    { icon: Route, position: "bottom-[15%] left-[20%]", delay: "1s" },
    { icon: Building2, position: "bottom-[5%] right-[15%]", delay: "1.5s" },
    { icon: Gauge, position: "top-[40%] left-[5%]", delay: "2s" },
    { icon: Globe, position: "bottom-[30%] right-[5%]", delay: "2.5s" },
  ];

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "Comment ça marche" },
    { href: "#pricing", label: "Tarifs" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar variant="marketing" navItems={navItems} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.brand/0.1),transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-brand text-brand-foreground border-brand animate-pulse mx-auto">
            🚀 La Bourse de Fret Intelligente du Maroc
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight max-w-6xl mx-auto">
            Connectez Expéditeurs et Transporteurs pour un{" "}
            <span className="bg-gradient-to-r from-brand via-primary to-accent bg-clip-text text-transparent">
              Transport Optimisé
            </span>{" "}
            et des{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-brand bg-clip-text text-transparent">
              Coûts Réduits
            </span>{" "}
            – Grâce au{" "}
            <span className="bg-gradient-to-r from-brand to-secondary bg-clip-text text-transparent">
              Bidding Réversible !
            </span>
          </h1>
          <div className="grid lg:grid-cols-2 gap-16 items-center text-left mt-12">
            {/* Colonne de gauche : Description et Boutons */}
            <div>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
                Transmarket est la première plateforme marocaine qui met en
                relation directe les entreprises ayant des marchandises à
                expédier et les transporteurs avec des camions disponibles.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand to-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group text-lg px-8 py-4 text-brand-foreground"
                >
                  Commencer Maintenant
                  <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-accent/10 text-lg px-8 py-4 bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Voir la Démo
                </Button>
              </div>
            </div>
            {/* Colonne de droite : Visualisation */}
            <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px] -mt-16 lg:-mt-0">
              {/* Central Circle */}
              <div className="relative w-80 h-80 bg-gradient-to-br from-brand/20 to-primary/20 rounded-full border border-border/50 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl font-bold text-foreground mb-2">
                    1000+
                  </div>
                  <div className="text-muted-foreground text-xl">
                    Entreprises Connectées
                  </div>
                </div>
              </div>

              {/* Outer rings - Adjusted size and position for more space */}
              <div className="absolute inset-0 w-[calc(100%+80px)] h-[calc(100%+80px)] border border-border/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 w-[calc(100%+160px)] h-[calc(100%+160px)] border border-border/10 rounded-full animate-spin-reverse"></div>

              {/* Floating transport icons - Adjusted positions for better distribution */}
              {transportIcons.map((item, index) => (
                <div
                  key={index}
                  className={`absolute ${item.position} w-16 h-16 glass rounded-full flex items-center justify-center animate-float`}
                  style={{ animationDelay: item.delay }}
                >
                  <item.icon className="h-8 w-8 text-foreground" />
                </div>
              ))}

              {/* User avatars - Adjusted positions for better distribution */}
              <div className="absolute top-[5%] left-[40%] w-12 h-12 bg-gradient-to-br from-brand to-secondary rounded-full border-2 border-border flex items-center justify-center animate-bounce-slow">
                <span className="text-brand-foreground font-semibold text-sm">
                  EA
                </span>
              </div>
              <div
                className="absolute bottom-[10%] right-[30%] w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-border flex items-center justify-center animate-bounce-slow"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-primary-foreground font-semibold text-sm">
                  HC
                </span>
              </div>
              <div
                className="absolute top-[25%] right-[20%] w-12 h-12 bg-gradient-to-br from-success to-secondary rounded-full border-2 border-border flex items-center justify-center animate-bounce-slow"
                style={{ animationDelay: "2s" }}
              >
                <span className="text-success-foreground font-semibold text-sm">
                  MD
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color} mr-2`} />
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    {stat.number}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-card-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-destructive/20 text-destructive-foreground border-destructive/30">
              ⚠️ Les Défis du Transport au Maroc
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Inefficacité et Coûts Élevés : Un Frein pour les Entreprises
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Le secteur du transport de marchandises au Maroc fait face à des
              défis majeurs, impactant directement la rentabilité et
              l&apos;efficacité des entreprises.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Expéditeurs : Difficulté à trouver des transporteurs",
                description:
                  "Les entreprises peinent à trouver des transporteurs fiables et adaptés, perdant un temps précieux dans la recherche et la négociation.",
              },
              {
                icon: Truck,
                title: "Transporteurs : Trajets à vide et sous-optimisation",
                description:
                  "Plus de 40% des trajets se font avec des camions partiellement remplis, générant des pertes économiques et une empreinte carbone inutile.",
              },
              {
                icon: DollarSign,
                title: "Coûts Excessifs et Manque de Transparence",
                description:
                  "L'absence d'une plateforme centralisée entraîne des coûts de transaction élevés et un manque de visibilité sur les prix du marché.",
              },
            ].map((problem, index) => (
              <Card
                key={index}
                className="glass border-destructive/20 bg-destructive/10 hover:scale-105 transition-transform duration-200 group"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <problem.icon className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <CardTitle className="text-destructive-foreground">
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/20 text-success-foreground border-success/30">
              ✨ Notre Innovation
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Transmarket : La Solution Complète pour un Transport Efficace
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Notre plateforme révolutionne la mise en relation entre
              expéditeurs et transporteurs grâce à des fonctionnalités uniques
              et un système de bidding réversible.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-200"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                  >
                    <benefit.icon className="h-6 w-6 text-brand-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <Card className="p-8 glass border-brand/30 shadow-2xl hover:scale-105 transition-transform duration-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand to-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Zap className="h-10 w-10 text-brand-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Bidding Réversible
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Notre innovation exclusive permet aux expéditeurs ET aux
                    transporteurs de lancer des enchères, créant un marché
                    dynamique dans les deux sens, maximisant l&apos;utilisation
                    des ressources.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-brand/20 rounded-xl border border-brand/30">
                      <span className="font-medium text-foreground">
                        Expéditeurs → Transporteurs
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-primary/20 rounded-xl border border-primary/30">
                      <span className="font-medium text-foreground">
                        Transporteurs → Expéditeurs
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-card-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-brand text-brand-foreground border-brand">
              🔄 Processus Simple
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Comment ça Marche
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un processus simplifié en 4 étapes pour révolutionner vos
              transports, de l&apos;inscription à la livraison.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <Card className="p-6 h-full glass hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="text-2xl font-bold text-brand-foreground">
                        {step.step}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-foreground">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <step.icon className="h-8 w-8 text-brand mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-brand/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-primary-foreground border-primary">
              💰 Tarification Simple
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pay-as-You-Go
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un modèle économique transparent sans engagement, payez uniquement
              ce que vous consommez.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card className="p-8 glass border-brand/30 shadow-2xl relative overflow-hidden hover:scale-105 transition-transform duration-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand/20 to-primary/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <DollarSign className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  2€ par jour
                </h3>
                <p className="text-muted-foreground mb-8">
                  Accès complet à toutes les fonctionnalités via votre solde.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "Accès illimité aux offres de fret et de transport",
                    "Système de bidding réversible unique",
                    "Moteur de matching IA intelligent",
                    "Vérification complète des entreprises et chauffeurs",
                    "Support client 24/7 dédié",
                    "Suivi des transports en temps réel",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" passHref>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-brand to-primary hover:shadow-lg hover:scale-105 transition-all duration-200 text-brand-foreground"
                  >
                    Commencer Maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground/80 mt-4">
                  Aucun engagement • Rechargez votre solde à la demande
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-brand text-brand-foreground border-brand">
              💬 Témoignages
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ils Nous Font Confiance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez les retours d&apos;expérience de nos clients satisfaits
              qui ont transformé leur logistique.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 glass hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand to-primary rounded-full flex items-center justify-center">
                      <span className="text-brand-foreground font-semibold">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground italic leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-brand font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.brand/0.1),transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Prêt à Optimiser Votre Logistique avec Transmarket ?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Rejoignez dès aujourd&apos;hui la première bourse de fret
            intelligente du Maroc et transformez votre façon de transporter et
            d&apos;expédier des marchandises.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" passHref>
              <Button
                size="lg"
                className="bg-gradient-to-r from-brand to-primary hover:shadow-lg hover:scale-105 transition-all duration-200 group text-lg px-8 py-4 text-brand-foreground"
              >
                <Users className="mr-2 h-5 w-5" />
                Créer mon Compte Gratuitement
                <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-accent/10 text-lg px-8 py-4 bg-transparent"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Programmer une Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-background text-foreground py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-primary rounded-xl flex items-center justify-center">
                  <Truck className="h-6 w-6 text-brand-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  Transmarket
                </span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                La première bourse de fret intelligente du Maroc. Connectant
                expéditeurs et transporteurs pour un transport optimisé.
              </p>
            </div>
            {[
              {
                title: "Plateforme",
                links: [
                  "Pour Expéditeurs",
                  "Pour Transporteurs",
                  "API Développeurs",
                  "Mobile App",
                ],
              },
              {
                title: "Support",
                links: [
                  "Centre d'Aide",
                  "Documentation",
                  "Contact",
                  "Status",
                ],
              },
              {
                title: "Entreprise",
                links: ["À Propos", "Carrières", "Presse", "Partenaires"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4 text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © 2025 Transmarket. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {[
                "Conditions d'utilisation",
                "Politique de confidentialité",
                "Mentions légales",
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
