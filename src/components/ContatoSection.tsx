import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "./useScrollAnimation";

interface FeedbackMessage {
  text: string;
  type: "error" | "success";
}

// Web3Forms access key
const WEB3FORMS_KEY = "9108229a-23d2-468c-95c6-1308f7925cbd";
const EMAIL_DESTINO = "atendimento@nardiniseguros.com.br";
const WHATSAPP_NUMBER = "551936214061";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os serviços da Nardini Seguros."
)}`;

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskPlaca(value: string): string {
  const clean = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 7);
  if (clean.length <= 3) return clean;
  // Mercosul: 5o caractere (index 4) e letra → ABC1D23
  if (clean.length >= 5 && /[A-Z]/.test(clean[4])) return clean;
  // Formato antigo: ABC-1234
  return `${clean.slice(0, 3)}-${clean.slice(3)}`;
}

export default function ContatoSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [form, setForm] = useState({ nome: "", dataNascimento: "", telefone: "", placa: "", cidade: "" });
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nome = form.nome.trim().slice(0, 100);
    const dataNascimento = form.dataNascimento.trim();
    const telefone = form.telefone.trim().slice(0, 20);
    const placa = form.placa.trim().slice(0, 10);
    const cidade = form.cidade.trim().slice(0, 100);

    if (!nome || !telefone) {
      setFeedback({ text: "Preencha seu nome e telefone.", type: "error" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setSending(true);

    try {
      const emailData = new FormData();
      emailData.append("access_key", WEB3FORMS_KEY);
      emailData.append("subject", `Nova cotação - ${nome} | Nardini Seguros`);
      emailData.append("from_name", "Nardini Seguros - Site");
      emailData.append("to", EMAIL_DESTINO);
      emailData.append("Nome", nome);
      emailData.append("Data de Nascimento", dataNascimento || "Não informada");
      emailData.append("Telefone", telefone);
      emailData.append("Placa", placa || "Não informada");
      emailData.append("Cidade", cidade || "Não informada");
      emailData.append("redirect", "false");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: emailData,
      });

      const result = await response.json();

      if (result.success) {
        setFeedback({ text: "Mensagem enviada com sucesso! Entraremos em contato em breve.", type: "success" });
        setForm({ nome: "", dataNascimento: "", telefone: "", placa: "", cidade: "" });
      } else {
        setFeedback({ text: "Erro ao enviar. Tente novamente ou fale pelo WhatsApp.", type: "error" });
      }
    } catch {
      setFeedback({ text: "Erro ao enviar. Tente novamente ou fale pelo WhatsApp.", type: "error" });
    }

    setSending(false);
    setTimeout(() => setFeedback(null), 6000);
  };

  const infoItems = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "(19) 3621-4061",
      href: WHATSAPP_URL,
      external: true,
      cta: "Abrir WhatsApp",
    },
    {
      icon: Phone,
      label: "Telefone",
      value: "(19) 3621-4061",
      href: "tel:+551936214061",
      external: false,
      cta: "Ligar agora",
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
          <h2 id="contato-heading" className="font-display text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Entre em Contato</h2>
          <p className="text-muted-foreground text-lg">Solicite sua cotação ou tire suas dúvidas.</p>
        </div>

        <div className={`grid md:grid-cols-2 gap-12 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-background shadow-lg rounded-2xl p-8 border border-border/50">
            <h3 className="font-display text-center text-base md:text-xl font-extrabold text-primary mb-1 tracking-tight">Solicite sua cotação por e-mail</h3>
            <p className="text-muted-foreground text-center text-xs mb-4">Preencha os dados e nossa equipe retorna em breve.</p>
            <Input
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              maxLength={100}
              required
              aria-label="Nome completo"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Data de Nascimento (dd/mm/aaaa)"
              value={form.dataNascimento}
              onChange={(e) => setForm({ ...form, dataNascimento: maskDate(e.target.value) })}
              maxLength={10}
              aria-label="Data de nascimento"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Telefone"
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
              maxLength={15}
              required
              aria-label="Número de telefone"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Placa (ABC-1234 ou ABC1D23)"
              value={form.placa}
              onChange={(e) => setForm({ ...form, placa: maskPlaca(e.target.value) })}
              maxLength={8}
              aria-label="Placa do veículo"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              maxLength={100}
              aria-label="Cidade"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Enviar por E-mail
                </>
              )}
            </Button>
            {feedback && (
              <div className={`text-sm text-center p-3 rounded-lg ${feedback.type === "error" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}>
                {feedback.text}
              </div>
            )}
          </form>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-linear-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-4 mb-2">
              <p className="text-sm text-primary font-semibold mb-2">Prefere falar direto?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Clique em um dos contatos abaixo e fale com a nossa equipe agora mesmo.</p>
            </div>
            {infoItems.map((item) => {
              const content = (
                <>
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-secondary/15 to-secondary/5 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-primary text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm break-words">{item.value}</p>
                    {item.cta && (
                      <p className="text-secondary text-xs font-semibold mt-1">{item.cta} →</p>
                    )}
                  </div>
                </>
              );

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 shadow-sm border border-border/50 hover:shadow-md hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-200"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 shadow-sm border border-border/50">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
