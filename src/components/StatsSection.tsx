import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const stats = [
  { value: 150, suffix: "M+", prefix: "R$ ", label: "em imóveis negociados", isMoney: true },
  { value: 500, suffix: "+", prefix: "", label: "clientes atendidos", isMoney: false },
  { value: 12, suffix: "", prefix: "", label: "anos de experiência", isMoney: false },
  { value: 98, suffix: "%", prefix: "", label: "de satisfação", isMoney: false },
];

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

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Componente para cada stat com contador
  const StatItem = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
    const count = useCounter(isVisible ? stat.value : 0, 2000, 0);
    
    return (
      <div
        className={cn(
          "text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
      >
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
          {stat.prefix}
          {isVisible ? count : 0}
          <span className="text-[#FFD43B]">{stat.suffix}</span>
        </p>
        <p className="text-white/70 text-sm md:text-base">
          {stat.label}
        </p>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#001F3F]"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
