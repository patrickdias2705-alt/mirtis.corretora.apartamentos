import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Send, Instagram, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    icon: Phone,
    label: "WhatsApp",
    value: "(11) 91651-2202",
    link: "https://wa.me/5511916512202",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "mirtis@consutora.com.br",
    link: "mailto:mirtis@consutora.com.br",
  },
  {
    icon: MapPin,
    label: "Localização",
    value: "Av. Santo Antônio, 1626 - Vila Osasco, Osasco - SP",
    link: "https://maps.google.com/?q=Av.+Santo+Antônio,+1626+-+Vila+Osasco,+Osasco+-+SP,+06083-080",
  },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function ContactSection() {
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
      id="contato"
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl w-full overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 w-full">
          {/* Left - Info */}
          <div className="text-left w-full min-w-0">
            <Badge
              variant="secondary"
              className="mb-4"
            >
              Contato
            </Badge>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 break-words">
              Vamos conversar sobre o seu próximo imóvel?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-10 break-words">
              Entre em contato comigo e vamos encontrar juntos o imóvel perfeito para você e sua família.
            </p>

            {/* Contact Info */}
            <div className="space-y-6 mb-10 w-full">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  className="flex items-center gap-3 sm:gap-4 group w-full"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                    {info.label === "WhatsApp" ? (
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block' }}
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    ) : (
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" style={{ display: 'block' }} />
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0 overflow-hidden">
                    <p className="text-xs sm:text-sm text-muted-foreground">{info.label}</p>
                    <p className="text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors break-words">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="gap-2 bg-[#25D366] hover:bg-[#25D366]/90 transition-all"
                onClick={() => window.open('https://wa.me/5511916512202', '_blank')}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Falar pelo WhatsApp
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-10 justify-center lg:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-card p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-border w-full overflow-hidden">
            <h3 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-4 sm:mb-6">
              Envie uma mensagem
            </h3>

            <form className="space-y-4 sm:space-y-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="w-full min-w-0">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nome
                  </label>
                  <Input placeholder="Seu nome" className="h-12 w-full" />
                </div>
                <div className="w-full min-w-0">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Telefone
                  </label>
                  <Input placeholder="(00) 00000-0000" className="h-12 w-full" />
                </div>
              </div>

              <div className="w-full min-w-0">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  E-mail
                </label>
                <Input type="email" placeholder="seu@email.com" className="h-12 w-full" />
              </div>

              <div className="w-full min-w-0">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  O que você procura?
                </label>
                <Textarea
                  placeholder="Conte-me sobre o imóvel que você está buscando..."
                  className="min-h-[120px] resize-none w-full"
                />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2">
                Enviar Mensagem
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
