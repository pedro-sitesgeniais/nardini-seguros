import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "./useScrollAnimation";

const WHATSAPP_URL = "https://wa.me/551936214061?text=Olá! Ainda tenho dúvidas e gostaria de ajuda.";

const faqs = [
  { q: "Qual a diferença entre seguro e proteção veicular?", a: "O seguro é oferecido por seguradoras regulamentadas pela SUSEP, enquanto a proteção veicular é oferecida por associações e cooperativas. Ambos protegem seu veículo, mas com estruturas diferentes. Nós trabalhamos com as duas modalidades." },
  { q: "A proteção veicular aceita veículos antigos?", a: "Sim! Uma das grandes vantagens da proteção veicular é aceitar veículos de qualquer ano, incluindo modelos antigos que normalmente são recusados por seguradoras." },
  { q: "Como funciona o rastreamento veicular?", a: "Instalamos um equipamento discreto no seu veículo que permite acompanhar sua localização em tempo real pelo celular. Em caso de furto ou roubo, a central 24h atua para recuperar o veículo." },
  { q: "Motoristas de aplicativo (Uber/99) podem contratar?", a: "Sim! Aceitamos motoristas de aplicativo sem restrições. A proteção veicular é ideal para quem roda muito e precisa de uma cobertura acessível." },
  { q: "O atendimento é realmente 24 horas?", a: "Sim! Oferecemos assistência 24h com atendimento humanizado. Você fala com pessoas reais, não com robôs." },
  { q: "Como solicitar uma cotação?", a: "É simples! Clique no botão 'Solicite uma Cotação' ou entre em contato pelo WhatsApp (19) 99137-1808. Respondemos rapidamente!" },
];

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="faq" className="py-24 bg-muted/50" ref={ref}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Perguntas Frequentes</h2>
          <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre nossos serviços.</p>
        </div>
        <div className={`transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "200ms" }}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-background rounded-xl border border-border/50 px-5 shadow-sm hover:shadow-md transition-shadow duration-200 data-[state=open]:shadow-lg data-[state=open]:border-l-4 data-[state=open]:border-l-secondary"
              >
                <AccordionTrigger className="text-left font-display text-primary font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "400ms" }}>
          <p className="text-muted-foreground mb-3">Ainda tem dúvidas?</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg transition-all duration-200"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
