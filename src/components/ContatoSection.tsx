import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "./useScrollAnimation";

interface FeedbackMessage {
  text: string;
  type: "error" | "success";
}

const WHATSAPP_NUMBER = "551936214061";
const EMAIL_DESTINO = "atendimento@nardiniseguros.com.br";

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

  const handleSubmit = (e: React.FormEvent) => {
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

    const whatsText = encodeURIComponent(
      `Olá! Gostaria de solicitar uma cotação.\n\nNome: ${nome}\nData de Nascimento: ${dataNascimento || "Não informada"}\nTelefone: ${telefone}\nPlaca: ${placa || "Não informada"}\nCidade: ${cidade || "Não informada"}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsText}`, "_blank");

    setFeedback({ text: "Redirecionando para o WhatsApp...", type: "success" });
    setForm({ nome: "", dataNascimento: "", telefone: "", placa: "", cidade: "" });
    setTimeout(() => setFeedback(null), 5000);
  };

  const infoItems = [
    { icon: Phone, label: "Telefone", lines: ["(19) 3621-4061"] },
    { icon: Mail, label: "E-mail", lines: [EMAIL_DESTINO] },
    { icon: MapPin, label: "Endereço", lines: ["Rua São Gabriel, 733, Americana, SP 13472-000"] },
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
                  Enviar via WhatsApp
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
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 shadow-sm border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-secondary/15 to-secondary/5 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-display font-bold text-primary text-sm">{item.label}</p>
                  {item.lines.map((line) => (
                    <p key={line} className="text-muted-foreground text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
