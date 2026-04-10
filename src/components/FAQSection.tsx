import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "./useScrollAnimation";


const faqs = [
  { q: "A Nardini Seguros realmente vende ProAuto?", a: "Sim! A Nardini Seguros é parceira autorizada da ProAuto. Trabalhamos diretamente com a ProAuto para oferecer proteção veicular de qualidade aos nossos clientes na região de Americana, Campinas e em todo o território nacional. Você pode contratar a proteção veicular ProAuto com total segurança através da Nardini." },
  { q: "Qual a diferença entre seguro e proteção veicular?", a: "A principal diferença está no modelo de funcionamento. O seguro funciona no modelo tradicional: a seguradora assume o risco, normalmente com análises mais rígidas e preços mais altos. Já a proteção veicular, como a oferecida pela ProAuto (que a Nardini Seguros comercializa como parceira autorizada), funciona no modelo associativo: os associados dividem os custos dos sinistros. Isso permite mensalidades mais acessíveis, menos burocracia, cobertura ampla (roubo, furto, colisão, incêndio, fenômenos naturais e assistência 24h) e aprovação mais rápida. A ProAuto está devidamente cadastrada e regulada junto à SUSEP." },
  { q: "Por que muitos motoristas preferem a ProAuto?", a: "Como parceira oficial da ProAuto, a Nardini Seguros pode afirmar: a ProAuto se destaca por oferecer preço competitivo, atendimento ágil, processo simples e total transparência nas regras e coberturas. Para quem busca proteção confiável e sem burocracia, a proteção veicular da ProAuto é uma opção mais prática e econômica do que o seguro tradicional. Através da Nardini, você contrata com a confiança de um atendimento humanizado." },
  { q: "A proteção veicular aceita veículos antigos?", a: "Sim! Uma das grandes vantagens da proteção veicular é aceitar veículos de qualquer ano, incluindo modelos antigos que normalmente são recusados por seguradoras." },
  { q: "Como funciona o rastreamento veicular?", a: "Instalamos um equipamento discreto no seu veículo que permite acompanhar sua localização em tempo real pelo celular. Em caso de furto ou roubo, a central 24h atua para recuperar o veículo." },
  { q: "Motoristas de aplicativo (Uber/99) podem contratar?", a: "Sim! Aceitamos motoristas de aplicativo sem restrições. A proteção veicular é ideal para quem roda muito e precisa de uma cobertura acessível." },
  { q: "O atendimento é realmente 24 horas?", a: "Sim! Oferecemos assistência 24h com atendimento humanizado. Você fala com pessoas reais, não com robôs." },
  { q: "Como solicitar uma cotação?", a: "É simples! Clique no botão 'Solicite uma Cotação' e preencha o formulário. Você também pode ligar para (19) 3621-4061. Respondemos rapidamente!" },
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
            href="#contato"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg transition-all duration-200"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
