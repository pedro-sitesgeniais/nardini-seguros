import { Phone, Mail, MapPin } from "lucide-react";
import { useScrollAnimation } from "./useScrollAnimation";

const EMAIL_DESTINO = "atendimento@nardiniseguros.com.br";

export default function ContatoSection() {
  const { ref, isVisible } = useScrollAnimation();

  const infoItems = [
    {
      icon: Phone,
      label: "Telefone",
      value: "(19) 3621-4061",
      href: null,
      external: false,
      cta: null,
    },
    {
      icon: Mail,
      label: "E-mail",
      value: EMAIL_DESTINO,
      href: `mailto:${EMAIL_DESTINO}`,
      external: false,
      cta: "Enviar e-mail",
    },
    {
      icon: MapPin,
      label: "Endereço",
      value: "Rua São Gabriel, 733, Americana, SP 13472-000",
      href: null,
      external: false,
      cta: null,
    },
  ];

  return (
    <section id="contato" className="py-24" ref={ref} aria-labelledby="contato-heading">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 id="contato-heading" className="font-display text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Fale com a Nardini Seguros</h2>
          <p className="text-muted-foreground text-lg">Nossos canais de contato. Atendimento humanizado 24h.</p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {infoItems.map((item) => {
            const content = (
              <>
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-secondary/15 to-secondary/5 flex items-center justify-center shrink-0 mb-3">
                  <item.icon className="h-6 w-6 text-secondary" />
                </div>
                <p className="font-display font-bold text-primary text-sm mb-1">{item.label}</p>
                <p className="text-muted-foreground text-sm break-word">{item.value}</p>
                {item.cta && (
                  <p className="text-secondary text-xs font-semibold mt-2">{item.cta} →</p>
                )}
              </>
            );

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex flex-col p-6 rounded-xl bg-muted/50 shadow-sm border border-border/50 hover:shadow-md hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-200"
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={item.label} className="flex flex-col p-6 rounded-xl bg-muted/50 shadow-sm border border-border/50">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
