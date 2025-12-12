import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bed, Bath, Square, MapPin, Heart, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import projetosData from "../../data/projetos.json";

interface Property {
  id: string;
  nome: string;
  cidade: string;
  bairro: string;
  preco: string;
  beds: number;
  baths: number;
  area: number;
  galeria: string[];
  tag: string;
  entrega?: string;
  banco?: string;
  metragem?: string;
  status?: string;
}

export function FeaturedProperties() {
  const [isVisible, setIsVisible] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar dados dos projetos
    const projetos = projetosData as any[];
    const propertiesList: Property[] = projetos.map((projeto, index) => ({
      id: projeto.id,
      nome: projeto.nome,
      cidade: projeto.cidade,
      bairro: projeto.bairro || projeto.cidade,
      preco: projeto.preco || "Sob consulta",
      beds: projeto.beds || 2,
      baths: projeto.baths || 2,
      area: projeto.area || 100,
      galeria: projeto.galeria || [],
      tag: index === 0 ? "Destaque" : index === 1 ? "Novo" : index === 2 ? "Exclusivo" : "",
      entrega: projeto.entrega,
      banco: projeto.banco,
      metragem: projeto.metragem,
      status: projeto.status || 'na_planta',
    }));
    setProperties(propertiesList);
    
    // Verificar se há busca na URL ou hash
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || urlParams.get('search');
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const filtered = propertiesList.filter((p) =>
        p.nome.toLowerCase().includes(searchLower) ||
        p.cidade.toLowerCase().includes(searchLower) ||
        p.bairro.toLowerCase().includes(searchLower)
      );
      if (filtered.length > 0) {
        setProperties(filtered);
      }
    }
  }, []);

  useEffect(() => {
    // No mobile, mostrar imediatamente
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: isMobile ? 0.05 : 0.2 } // Threshold menor no mobile
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="imoveis"
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FFD43B]/10"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <Badge
            variant="secondary"
            className="mb-3 sm:mb-4"
          >
            Destaques
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Imóveis Selecionados para Você
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Confira nossa seleção exclusiva de imóveis cuidadosamente escolhidos
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center sm:justify-items-stretch">
          {properties.map((property, index) => (
            <div
              key={property.id}
              data-projeto-id={property.id}
              data-categoria={property.status || 'na_planta'}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 w-full"
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                opacity: 1,
                transform: 'translateY(0)'
              }}
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40">
                {property.galeria && property.galeria.length > 0 && !property.galeria[0].includes('placeholder') ? (
                <img
                    src={property.galeria[0]}
                    alt={property.nome}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/30">{property.nome.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {property.tag && (
                    <Badge className="bg-primary text-primary-foreground">
                  {property.tag}
                </Badge>
                  )}
                  {property.status && (
                    <Badge 
                      className={
                        property.status === 'em_construcao' 
                          ? 'bg-green-600 text-white' 
                          : property.status === 'ambos'
                          ? 'bg-blue-600 text-white'
                          : 'bg-orange-600 text-white'
                      }
                    >
                      {property.status === 'em_construcao' 
                        ? 'Em Construção' 
                        : property.status === 'ambos'
                        ? 'Ambos'
                        : 'Na Planta'}
                    </Badge>
                  )}
                </div>
                
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card hover:text-destructive transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm mb-1.5 sm:mb-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">{property.bairro}, {property.cidade}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {property.nome}
                </h3>
                
                {property.metragem && (
                  <div className="mb-2 sm:mb-3">
                    <Badge variant="outline" className="text-xs">
                      {property.metragem}
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {property.beds}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {property.baths}
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {property.area}m²
                  </div>
                </div>

                {(property.entrega || property.banco) && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                    {property.entrega && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                        <span className="font-semibold text-primary">{property.entrega}</span>
                      </div>
                    )}
                    {property.banco && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{property.banco}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-border">
                  <span className="text-lg sm:text-xl font-bold text-primary text-center sm:text-left">
                    Sob consulta
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full sm:w-auto group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all text-xs sm:text-sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      // Adicionar animação de fade antes de navegar
                      const card = e.currentTarget.closest('[data-projeto-id]') as HTMLElement;
                      if (card) {
                        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                        card.style.opacity = '0.7';
                        card.style.transform = 'scale(0.98)';
                      }
                      setTimeout(() => {
                        navigate(`/imovel/${property.id}`);
                      }, 150);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem de Nenhum Resultado */}
        <div
          id="no-results"
          className="hidden text-center py-12 sm:py-16 md:py-20"
        >
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Não encontramos imóveis que correspondam à sua busca. Tente usar outros termos ou verifique a ortografia.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                // Limpar busca e mostrar todos
                const input = document.querySelector('input[name="search"]') as HTMLInputElement;
                if (input) {
                  input.value = '';
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                }
                const cards = document.querySelectorAll('[data-projeto-id]');
                cards.forEach((card: any) => {
                  card.style.display = 'flex';
                  card.style.opacity = '1';
                });
                const noResults = document.getElementById('no-results');
                if (noResults) {
                  noResults.style.display = 'none';
                }
              }}
            >
            Ver Todos os Imóveis
          </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
