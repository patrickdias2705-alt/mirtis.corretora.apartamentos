import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import projetosData from "../../data/projetos.json";

// Função para animar contador
function useCounter(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = start;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [categoria, setCategoria] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const count500 = useCounter(500, 2000, 0);
  const count12 = useCounter(12, 2000, 0);
  const count98 = useCounter(98, 2000, 0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Garantir que o vídeo tente carregar
    if (videoRef.current) {
      videoRef.current.load();
      // Tentar reproduzir
      videoRef.current.play().catch((error) => {
        console.warn('Erro ao reproduzir vídeo automaticamente:', error);
      });
    }
  }, []);

  // Busca em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || categoria !== 'todos') {
        aplicarFiltros(categoria, searchQuery);
      } else {
        // Se não há busca, mostrar todos
        const cards = document.querySelectorAll('[data-projeto-id]');
        cards.forEach((card: any) => {
          card.style.display = 'flex';
          card.style.opacity = '1';
        });
        // Esconder mensagem de "nenhum resultado"
        const noResults = document.getElementById('no-results');
        if (noResults) {
          noResults.style.display = 'none';
        }
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, categoria]);

  const aplicarFiltros = (categoriaSelecionada: string, query?: string) => {
    const searchLower = query ? query.toLowerCase().trim() : '';
    const cards = document.querySelectorAll('[data-projeto-id]');
    let visibleCount = 0;
    
    cards.forEach((card: any) => {
      const cardId = card.getAttribute('data-projeto-id');
      const cardCategoria = card.getAttribute('data-categoria');
      const projeto = (projetosData as any[]).find((p: any) => p.id === cardId);
      
      if (projeto) {
        // Filtro por categoria
        let matchesCategoria = true;
        if (categoriaSelecionada !== 'todos') {
          if (categoriaSelecionada === 'na_planta') {
            matchesCategoria = cardCategoria === 'na_planta' || cardCategoria === 'ambos';
          } else if (categoriaSelecionada === 'em_construcao') {
            matchesCategoria = cardCategoria === 'em_construcao' || cardCategoria === 'ambos';
          }
        }
        
        // Filtro por busca de texto (busca parcial)
        let matchesBusca = true;
        if (searchLower) {
          matchesBusca = 
            projeto.nome.toLowerCase().includes(searchLower) ||
            projeto.enderecoCompleto.toLowerCase().includes(searchLower) ||
            projeto.bairro.toLowerCase().includes(searchLower) ||
            projeto.cidade.toLowerCase().includes(searchLower);
        }
        
        const shouldShow = matchesCategoria && matchesBusca;
        // Usar display flex para manter o layout do grid
        card.style.display = shouldShow ? 'flex' : 'none';
        card.style.opacity = shouldShow ? '1' : '0';
        if (shouldShow) visibleCount++;
      }
    });

    // Mostrar/ocultar mensagem de "nenhum resultado"
    const noResults = document.getElementById('no-results');
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
          style={{ minWidth: '100%', minHeight: '100%' }}
          onError={(e) => {
            console.error('Erro ao carregar vídeo de fundo:', e);
            const video = e.currentTarget;
            console.error('Vídeo src:', video.src);
            console.error('Vídeo networkState:', video.networkState);
            console.error('Vídeo error:', video.error);
            // Não definir videoError para manter tentando carregar
          }}
          onLoadedData={() => {
            console.log('Vídeo de fundo carregado com sucesso');
          }}
          onCanPlay={() => {
            console.log('Vídeo pode ser reproduzido');
            if (videoRef.current) {
              videoRef.current.play().catch(console.warn);
            }
          }}
        >
          <source src="/Cria_um_video_202512111740.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 sm:pt-28 md:pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-4 sm:mb-6 md:mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-white">
              Apartamentos, Casas e Terrenos
            </span>
          </div>

          {/* Title */}
          <h1
            className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 sm:mb-5 md:mb-6 px-2 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Encontre o imóvel dos seus sonhos com quem entende do assunto
          </h1>

          {/* Subtitle */}
          <p
            className={`text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Corretora especializada em imóveis de alto padrão. Atendimento personalizado e exclusivo para você.
          </p>

          {/* Search Bar */}
          <div
            className={`max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              {/* Efeito de vidro/gota d'água */}
              <div 
                className="backdrop-blur-xl bg-white/20 rounded-3xl p-2 shadow-2xl border border-white/30"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
                }}
              >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('search') as string;
                  const categoriaSelecionada = categoria;
                  
                  // Scroll para a seção de imóveis e filtrar
                  window.location.href = `#imoveis`;
                  setTimeout(() => {
                    const element = document.getElementById('imoveis');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    aplicarFiltros(categoriaSelecionada, query);
                  }, 300);
                }}
                className="flex flex-col gap-3"
              >
                {/* Filtro de Categoria */}
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoria('todos');
                      setTimeout(() => {
                        window.location.href = `#imoveis`;
                        setTimeout(() => {
                          const element = document.getElementById('imoveis');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                          aplicarFiltros('todos');
                        }, 300);
                      }, 100);
                    }}
                    className={`flex-1 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 active:scale-95 hover:scale-105 ${
                      categoria === 'todos'
                        ? 'bg-[#FFD43B] text-[#001F3F] shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoria('na_planta');
                      setTimeout(() => {
                        window.location.href = `#imoveis`;
                        setTimeout(() => {
                          const element = document.getElementById('imoveis');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                          aplicarFiltros('na_planta');
                        }, 300);
                      }, 100);
                    }}
                    className={`flex-1 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 active:scale-95 hover:scale-105 ${
                      categoria === 'na_planta'
                        ? 'bg-[#FFD43B] text-[#001F3F] shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Na Planta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoria('em_construcao');
                      setTimeout(() => {
                        window.location.href = `#imoveis`;
                        setTimeout(() => {
                          const element = document.getElementById('imoveis');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                          aplicarFiltros('em_construcao');
                        }, 300);
                      }, 100);
                    }}
                    className={`flex-1 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 active:scale-95 hover:scale-105 ${
                      categoria === 'em_construcao'
                        ? 'bg-[#FFD43B] text-[#001F3F] shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Em Construção
                  </button>
                </div>
                
                {/* Barra de Busca */}
                <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/80 z-10" />
                  <Input
                      name="search"
                    type="text"
                    placeholder="Onde você quer morar?"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value.trim()) {
                          // Se apagou tudo, mostrar todos novamente
                          const cards = document.querySelectorAll('[data-projeto-id]');
                          cards.forEach((card: any) => {
                            card.style.display = 'block';
                          });
                          const noResults = document.getElementById('no-results');
                          if (noResults) {
                            noResults.style.display = 'none';
                          }
                        }
                      }}
                      className="pl-10 sm:pl-12 h-12 sm:h-14 border-0 bg-white/30 backdrop-blur-sm text-white placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:bg-white/40 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl transition-all duration-300"
                      style={{
                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                      }}
                  />
                </div>
                  <Button 
                    type="submit" 
                    className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base md:text-lg font-semibold gap-2 bg-[#FFD43B] hover:bg-[#FFD43B]/90 text-[#001F3F] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      window.location.href = `#imoveis`;
                      setTimeout(() => {
                        const element = document.getElementById('imoveis');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  Buscar
                </Button>
                </div>
              </form>
              </div>
              {/* Brilho sutil */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-50 pointer-events-none" />
            </div>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mt-10 sm:mt-12 md:mt-16 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD43B]" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {isVisible ? `+${count500}` : "+0"}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-white/80">Imóveis Vendidos</span>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD43B]" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {isVisible ? count12 : "0"}
                  </span>
                </div>
              <span className="text-xs sm:text-sm text-white/80">Anos de Experiência</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD43B]" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {isVisible ? `${count98}%` : "0%"}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-white/80">Clientes Satisfeitos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Oculto no mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
Fri Dec 12 11:47:20 -03 2025
