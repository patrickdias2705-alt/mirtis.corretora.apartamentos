import { useState, useEffect, useRef } from "react";
import { Award, Users, Clock, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const highlights = [
  "Atendimento exclusivo e personalizado",
  "Expertise em imóveis de alto padrão",
  "Assessoria completa em documentação",
  "Negociação estratégica",
  "Acompanhamento pós-venda",
];

const stats = [
  { icon: Award, value: "12+", label: "Anos de Experiência" },
  { icon: Users, value: "500+", label: "Clientes Satisfeitos" },
  { icon: Clock, value: "24h", label: "Suporte Dedicado" },
  { icon: Shield, value: "100%", label: "Segurança" },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary/30 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Image Side */}
          <div
            className={cn(
              "relative transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <img
                src="/images/sobre-mirtis.png"
                alt="Mirtis - Corretora de Imóveis"
                className="relative rounded-2xl shadow-2xl w-full aspect-[4/5] object-cover object-top"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 bg-card p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-border animate-float">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-card-foreground">CRECI 259707</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Corretora Certificada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <Badge
              variant="secondary"
              className={cn(
                "mb-4 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Sobre Mim
            </Badge>

            <h2
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Mirtis
            </h2>

            <p
              className={cn(
                "text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-5 md:mb-6 transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Com mais de 12 anos de experiência no mercado imobiliário, sou especializada em 
              conectar pessoas aos imóveis dos seus sonhos. Meu compromisso é oferecer um 
              atendimento exclusivo, transparente e personalizado do primeiro contato até a 
              entrega das chaves.
            </p>

            {/* Highlights */}
            <div
              className={cn(
                "space-y-3 mb-8 transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div
              className={cn(
                "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-400",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card p-4 rounded-xl border border-border text-center hover:border-primary/50 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="transition-all duration-700 delay-500"
                onClick={() => {
                  const message = encodeURIComponent('Olá! Gostaria de conhecer mais sobre seus serviços.');
                  window.open(`https://wa.me/5511916512202?text=${message}`, '_blank');
                }}
              >
                Conhecer Mais
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
