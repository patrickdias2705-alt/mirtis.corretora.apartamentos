import { useState, useEffect } from "react";
import { Menu, X, Phone, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Imóveis", href: "#imoveis" },
    { label: "Sobre", href: "#sobre" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <img 
            src="/images/logo-mirtis.png" 
            alt="Mirtis Imóveis" 
            className={cn(
              "w-auto transition-all duration-300 object-contain",
              isScrolled ? "h-6 sm:h-8" : "h-16 sm:h-20 md:h-24"
            )}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector(link.href);
                if (target) {
                  // Animação suave de scroll
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:opacity-70 hover:scale-105 active:scale-95 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://wa.me/5511916512202"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            <Phone className="w-4 h-4" />
            (11) 91651-2202
          </a>
          <Button
            variant={isScrolled ? "default" : "secondary"}
            className={cn(
              "transition-all duration-300",
              !isScrolled && "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            )}
            onClick={() => window.open('https://wa.me/5511916512202', '_blank')}
          >
            Fale Comigo
          </Button>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
        <button
          className={cn(
                "md:hidden p-2 transition-colors duration-300 z-50",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[280px] sm:w-[320px] p-0 backdrop-blur-xl bg-white/10 border-r border-white/20 [&>button:last-child]:hidden"
            style={{
              boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1)',
              background: isScrolled 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            }}
          >
            <nav className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <img 
                  src="/images/logo-mirtis.png" 
                  alt="Mirtis Imóveis" 
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <SheetClose asChild>
                  <button
                    className="text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </SheetClose>
              </div>
              <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
                    className="text-white text-base font-medium py-3 px-4 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
              </div>
              <div className="mt-auto pt-6 space-y-3">
                <a
                  href="https://wa.me/5511916512202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white text-sm font-medium py-2"
                >
                  <Phone className="w-4 h-4" />
                  (11) 91651-2202
                </a>
                <Button 
                  className="w-full bg-[#FFD43B] hover:bg-[#FFD43B]/90 text-[#001F3F] font-semibold"
                  onClick={() => {
                    window.open('https://wa.me/5511916512202', '_blank');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Fale Comigo
                </Button>
              </div>
        </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
