import { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, Key, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Busque seu Imóvel",
    description: "Explore nossa seleção exclusiva de imóveis ou me conte exatamente o que você procura.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Atendimento Personalizado",
    description: "Entro em contato para entender suas necessidades e apresentar as melhores opções.",
  },
  {
    icon: Key,
    number: "03",
    title: "Visite e Escolha",
    description: "Agende visitas aos imóveis que mais combinam com você e sua família.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Realize seu Sonho",
    description: "Cuido de toda a documentação e negociação para você realizar seu sonho com segurança.",
  },
];

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  // Animação progressiva das etapas
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600); // Cada etapa aparece a cada 600ms

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      id="como-funciona"
      ref={sectionRef}
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className={cn(
              "mb-4 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Como Funciona
          </Badge>
          <h2
            className={cn(
              "text-3xl md:text-5xl font-bold text-foreground mb-4 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Seu caminho até o imóvel ideal
          </h2>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Um processo simples e transparente, do início ao fim
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const isActive = activeStep >= index;
            const isConnecting = activeStep === index && index < steps.length - 1;
            
            return (
            <div
              key={index}
              className={cn(
                  "relative group transition-all duration-500",
                  isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
              )}
            >
                {/* Connector Line - Animação progressiva */}
              {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 z-0">
                    <div 
                      className={cn(
                        "h-full bg-gradient-to-r transition-all duration-700",
                        isActive && index < steps.length - 1
                          ? "from-primary via-primary to-primary/30 w-full"
                          : "from-transparent to-transparent w-0"
                      )}
                      style={{
                        transitionDelay: isConnecting ? '300ms' : '0ms',
                        boxShadow: isActive && index < steps.length - 1 
                          ? '0 0 10px rgba(255, 212, 59, 0.5), 0 0 20px rgba(255, 212, 59, 0.3)'
                          : 'none'
                      }}
                    />
                    {/* Ponto de conexão animado */}
                    {isConnecting && (
                      <div 
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary animate-ping"
                        style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                      />
                    )}
                  </div>
                )}

                <div 
                  className={cn(
                    "relative bg-white rounded-2xl p-8 h-full border-2 transition-all duration-500",
                    isActive 
                      ? "border-primary shadow-xl shadow-primary/20" 
                      : "border-gray-200 shadow-md",
                    "hover:border-primary hover:shadow-2xl hover:shadow-primary/30"
                  )}
                >
                {/* Number */}
                  <span 
                    className={cn(
                      "absolute -top-4 -right-2 text-7xl font-bold transition-all duration-500",
                      isActive 
                        ? "text-primary/20" 
                        : "text-gray-200"
                    )}
                  >
                  {step.number}
                </span>

                  {/* Icon com animação de "acender" */}
                  <div 
                    className={cn(
                      "relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
                      isActive
                        ? "bg-primary scale-110 shadow-lg shadow-primary/50"
                        : "bg-gray-100 scale-100",
                      "group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-primary/60"
                    )}
                    style={{
                      animation: isActive && index === activeStep 
                        ? 'pulse-glow 1s ease-in-out infinite' 
                        : 'none'
                    }}
                  >
                    <step.icon 
                      className={cn(
                        "w-8 h-8 transition-all duration-500",
                        isActive
                          ? "text-white"
                          : "text-gray-400"
                      )} 
                    />
                    {/* Efeito de brilho quando ativa */}
                    {isActive && index === activeStep && (
                      <div className="absolute inset-0 rounded-2xl bg-primary/30 animate-ping" />
                    )}
                </div>

                {/* Content */}
                  <h3 
                    className={cn(
                      "text-xl font-semibold mb-3 relative z-10 transition-colors duration-500",
                      isActive ? "text-foreground" : "text-gray-400"
                    )}
                  >
                  {step.title}
                </h3>
                  <p 
                    className={cn(
                      "relative z-10 transition-colors duration-500",
                      isActive ? "text-muted-foreground" : "text-gray-400"
                    )}
                  >
                  {step.description}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
