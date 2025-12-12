import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import projetosData from "../../data/projetos.json";
import useEmblaCarousel from "embla-carousel-react";

export default function ImovelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState<any>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const projeto = projetosData.find((p: any) => p.id === id);
      if (projeto) {
        setImovel(projeto);
      } else {
        console.error('Projeto não encontrado:', id);
        setImovel(null);
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      setImovel(null);
    }
  }, [id]);

  useEffect(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (!imovel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              setTimeout(() => {
                navigate('/');
              }, 150);
            }}
          >
            Voltar para início
          </Button>
        </div>
      </div>
    );
  }

  const images = (imovel.galeria && Array.isArray(imovel.galeria) && imovel.galeria.length > 0)
    ? imovel.galeria 
    : ['/images/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-background animate-page-fade">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              // Animação antes de navegar
              const page = e.currentTarget.closest('.min-h-screen') as HTMLElement;
              if (page) {
                page.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                page.style.opacity = '0.8';
                page.style.transform = 'translateX(-10px)';
              }
              setTimeout(() => {
                navigate('/');
              }, 150);
            }}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>

      <main>
        {/* Carrossel de Imagens */}
        <section className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((img: string, index: number) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-primary/20 to-primary/40">
                    <img
                      src={img}
                      alt={`${imovel.nome} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <span class="text-6xl font-bold text-primary/30">${imovel.nome.charAt(0)}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all z-10"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all z-10"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index: number) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                  )}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Conteúdo */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-4">Empreendimento</Badge>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                    {imovel.nome}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4 sm:mb-5 md:mb-6">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{imovel.bairro && `${imovel.bairro}, `}{imovel.cidade}</span>
                  </div>
                  
                  {/* Informações Estratégicas */}
                  {(imovel.entrega || imovel.banco || imovel.implantacao) && (
                    <div className="bg-gradient-to-r from-[#FFD43B]/20 to-[#FFD43B]/10 rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-7 md:mb-8 border border-[#FFD43B]/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {imovel.entrega && (
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground mb-1">Entrega</span>
                            <Badge className="bg-[#FFD43B] text-[#001F3F] font-bold text-base px-4 py-2 w-fit">
                              {imovel.entrega}
                            </Badge>
                          </div>
                        )}
                        {imovel.banco && (
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground mb-1">Banco Financiador</span>
                            <span className="text-lg font-bold text-foreground">{imovel.banco}</span>
                          </div>
                        )}
                        {imovel.implantacao && imovel.implantacao !== 'A ser confirmada' && (
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground mb-1">Implantação</span>
                            <span className="text-lg font-semibold text-foreground">{imovel.implantacao}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-7 md:mb-8 border border-border">
                  <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3 sm:mb-4">Sobre o Empreendimento</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {imovel.descricao}
                  </p>
                </div>

                {/* Detalhes Específicos */}
                {imovel.detalhes && (
                  <div className="space-y-6">
                    {imovel.detalhes.plantas65 && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Plantas de 65 m²</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• {imovel.detalhes.plantas65.dormitorios}</li>
                          <li>• {imovel.detalhes.plantas65.vaga}</li>
                          <li>• {imovel.detalhes.plantas65.detalhes}</li>
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.plantas77 && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Plantas de 77 m²</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• {imovel.detalhes.plantas77.dormitorios}</li>
                          <li>• {imovel.detalhes.plantas77.vaga}</li>
                          <li>• {imovel.detalhes.plantas77.detalhes}</li>
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.lazer && Array.isArray(imovel.detalhes.lazer) && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Área de Lazer</h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.lazer.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.conveniencias && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Conveniências</h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.conveniencias.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.cobertura && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Cobertura Duplex {imovel.detalhes.cobertura.metragem}</h3>
                        <p className="text-muted-foreground mb-3">{imovel.detalhes.cobertura.detalhes}</p>
                      </div>
                    )}

                    {imovel.detalhes.plantas273 && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Plantas de 273 m²</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• <strong>Padrão:</strong> {imovel.detalhes.plantas273.padrao}</li>
                          <li>• <strong>Decorado:</strong> {imovel.detalhes.plantas273.decorado}</li>
                          <li>• <strong>Opção:</strong> {imovel.detalhes.plantas273.opcao}</li>
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.diferenciais && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Diferenciais das Unidades</h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.diferenciais.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.em_construcao && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-green-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-green-600">
                          ✅ {imovel.detalhes.em_construcao.titulo}
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          {imovel.detalhes.em_construcao.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.na_planta && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-blue-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-blue-600">
                          📐 {imovel.detalhes.na_planta.titulo}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.na_planta.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.servicos_pay_per_use && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">Serviços Pay Per Use</h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.servicos_pay_per_use.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.localizacao && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-blue-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-blue-600">
                          📍 {imovel.detalhes.localizacao.titulo}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.localizacao.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.lazer && !Array.isArray(imovel.detalhes.lazer) && imovel.detalhes.lazer.titulo && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-yellow-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-yellow-600">
                          🏊 {imovel.detalhes.lazer.titulo}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.lazer.itens && imovel.detalhes.lazer.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.infraestrutura && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-green-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-green-600">
                          🔒 {imovel.detalhes.infraestrutura.titulo}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.infraestrutura.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.arquitetura && (
                      <div className="bg-card rounded-2xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">
                          🏛️ {imovel.detalhes.arquitetura.titulo}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.arquitetura.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.plantas && imovel.detalhes.plantas.titulo && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-purple-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-purple-600">
                          📐 {imovel.detalhes.plantas.titulo}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                          {imovel.detalhes.plantas.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {imovel.detalhes.profissionais && (
                      <div className="bg-card rounded-2xl p-6 border border-border border-amber-500/30">
                        <h3 className="text-xl font-bold text-card-foreground mb-4 text-amber-600">
                          ✨ {imovel.detalhes.profissionais.titulo}
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          {imovel.detalhes.profissionais.itens.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#001F3F] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white sticky top-20 sm:top-24">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">Informações Técnicas</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/20">
                      <span className="text-white/70">Tipo</span>
                      <span className="font-semibold">{imovel.tipo}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/20">
                      <span className="text-white/70">Metragem</span>
                      <span className="font-semibold">{imovel.metragem}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/20">
                      <div className="flex items-center gap-2 text-white/70">
                        <Bed className="w-4 h-4" />
                        <span>Dormitórios</span>
                      </div>
                      <span className="font-semibold">{imovel.dormitorios}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/20">
                      <div className="flex items-center gap-2 text-white/70">
                        <Square className="w-4 h-4" />
                        <span>Vagas</span>
                      </div>
                      <span className="font-semibold">{imovel.vaga}</span>
                    </div>
                    {imovel.entrega && (
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-white/70">Entrega</span>
                        <Badge className="bg-[#FFD43B] text-[#001F3F] font-bold">
                          {imovel.entrega}
                        </Badge>
                      </div>
                    )}
                    {imovel.banco && (
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-white/70">Banco</span>
                        <span className="font-semibold text-[#FFD43B]">{imovel.banco}</span>
                      </div>
                    )}
                    {imovel.implantacao && imovel.implantacao !== 'A ser confirmada' && (
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-white/70">Implantação</span>
                        <span className="font-semibold text-sm text-right">{imovel.implantacao}</span>
                      </div>
                    )}
                    <div className="pt-4">
                      <span className="text-white/70 text-sm block mb-2">Endereço</span>
                      <span className="font-semibold">{imovel.enderecoCompleto}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        const message = encodeURIComponent(`Olá! Tenho interesse no empreendimento ${imovel.nome}. Gostaria de mais informações.`);
                        window.open(`https://wa.me/5511916512202?text=${message}`, '_blank');
                      }}
                      className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-lg hover:bg-[#25D366]/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Falar no WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

