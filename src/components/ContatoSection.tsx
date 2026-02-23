import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "./useScrollAnimation";

interface FeedbackMessage {
  text: string;
  type: "error" | "success";
}

// Web3Forms access key - gere a sua em https://web3forms.com
const WEB3FORMS_KEY = "YOUR_ACCESS_KEY_HERE";
const WHATSAPP_NUMBER = "5519991371808";
const EMAIL_DESTINO = "contato@sitesgeniais.com.br";

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

    // 1) Enviar email via Web3Forms
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
        setFeedback({ text: "Mensagem enviada! Abrindo WhatsApp...", type: "success" });
      } else {
        setFeedback({ text: "Abrindo WhatsApp para contato direto...", type: "success" });
      }
    } catch {
      // Se o email falhar, ainda abre o WhatsApp
      setFeedback({ text: "Abrindo WhatsApp para contato direto...", type: "success" });
    }

    // 2) Abrir WhatsApp sempre (backup garantido)
    const whatsText = encodeURIComponent(
      `Olá! Meu nome é ${nome}.\nData de Nascimento: ${dataNascimento}\nTelefone: ${telefone}\nPlaca: ${placa}\nCidade: ${cidade}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsText}`, "_blank");

    setSending(false);
    setForm({ nome: "", dataNascimento: "", telefone: "", placa: "", cidade: "" });
    setTimeout(() => setFeedback(null), 5000);
  };

  const infoItems = [
    { icon: Phone, label: "Telefones", lines: ["(19) 3621-4061", "(19) 99137-1808"] },
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
              onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
              maxLength={10}
              aria-label="Data de nascimento"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Telefone"
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              maxLength={20}
              required
              aria-label="Número de telefone"
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Placa"
              value={form.placa}
              onChange={(e) => setForm({ ...form, placa: e.target.value })}
              maxLength={10}
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
                  Enviar e abrir WhatsApp
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
