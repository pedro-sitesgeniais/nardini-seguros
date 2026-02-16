import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "./useScrollAnimation";

const testimonials = [
  { name: "Maria S.", text: "Atendimento excelente! Me senti segura desde o primeiro contato. Recomendo a todos.", rating: 5, since: "2022" },
  { name: "João P.", text: "Proteção veicular com o melhor custo-benefício da região. Equipe muito prestativa!", rating: 5, since: "2021" },
  { name: "Ana C.", text: "Resolvi tudo pelo WhatsApp, super prático. Assistência 24h realmente funciona!", rating: 5, since: "2023" },
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

export default function DepoimentosSection() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">O que dizem nossos clientes</h2>
          <p className="text-muted-foreground text-lg">A confiança dos nossos clientes é o nosso maior patrimônio.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative p-8 rounded-2xl bg-background shadow-md hover:shadow-xl hover:-translate-y-1 border border-border/50 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-secondary/15" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground text-base mb-6 leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="font-display font-bold text-primary text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">Cliente desde {t.since}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
