import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "./useScrollAnimation";

interface FeedbackMessage {
  text: string;
  type: "error" | "success";
}

export default function ContatoSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [form, setForm] = useState({ nome: "", telefone: "", veiculo: "", mensagem: "" });
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nome = form.nome.trim().slice(0, 100);
    const telefone = form.telefone.trim().slice(0, 20);
    const veiculo = form.veiculo.trim().slice(0, 50);
    const mensagem = form.mensagem.trim().slice(0, 500);

    if (!nome || !telefone) {
      setFeedback({ text: "Preencha seu nome e telefone.", type: "error" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const text = encodeURIComponent(`Olá! Meu nome é ${nome}.\nTelefone: ${telefone}\nVeículo: ${veiculo}\nMensagem: ${mensagem}`);
    window.open(`https://wa.me/5519991371808?text=${text}`, "_blank");
    setFeedback({ text: "Redirecionando para o WhatsApp...", type: "success" });
    setTimeout(() => setFeedback(null), 3000);
  };

  const infoItems = [
    { icon: Phone, label: "Telefones", lines: ["(19) 3621-4061", "(19) 99137-1808"] },
    { icon: Mail, label: "E-mail", lines: ["atendimento.americanasp@gmail.com"] },
    { icon: MapPin, label: "Endereço", lines: ["Americana, SP"] },
  ];

  return (
    <section id="contato" className="py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Entre em Contato</h2>
          <p className="text-muted-foreground text-lg">Solicite sua cotação ou tire suas dúvidas.</p>
        </div>

        <div className={`grid md:grid-cols-2 gap-12 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-background shadow-lg rounded-2xl p-8 border border-border/50">
            <Input
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              maxLength={100}
              required
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Telefone"
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              maxLength={20}
              required
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Input
              placeholder="Tipo de veículo"
              value={form.veiculo}
              onChange={(e) => setForm({ ...form, veiculo: e.target.value })}
              maxLength={50}
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Textarea
              placeholder="Sua mensagem (opcional)"
              value={form.mensagem}
              onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
              maxLength={500}
              rows={4}
              className="hover:border-secondary/50 focus:shadow-md transition-all"
            />
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              Enviar pelo WhatsApp
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center shrink-0">
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
