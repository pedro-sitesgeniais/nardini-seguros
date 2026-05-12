import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeedbackMessage {
  text: string;
  type: "error" | "success";
}

const WEB3FORMS_KEY = "9108229a-23d2-468c-95c6-1308f7925cbd";
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
  if (clean.length >= 5 && /[A-Z]/.test(clean[4])) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3)}`;
}

interface Props {
  variant?: "default" | "hero";
}

export default function CotacaoForm({ variant = "default" }: Props) {
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
        setFeedback({ text: "Erro ao enviar. Tente novamente em instantes.", type: "error" });
      }
    } catch {
      setFeedback({ text: "Erro ao enviar. Tente novamente em instantes.", type: "error" });
    }

    setSending(false);
    setTimeout(() => setFeedback(null), 6000);
  };

  const isHero = variant === "hero";
  const wrapperClass = isHero
    ? "space-y-3 bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-6 md:p-7 border border-white/20 text-left"
    : "space-y-4 bg-background shadow-lg rounded-2xl p-8 border border-border/50";
  const titleClass = isHero
    ? "font-display text-center text-lg md:text-xl font-extrabold text-primary mb-1 tracking-tight"
    : "font-display text-center text-base md:text-xl font-extrabold text-primary mb-1 tracking-tight";

  return (
    <form onSubmit={handleSubmit} className={wrapperClass}>
      <h3 className={titleClass}>Solicite sua cotação</h3>
      <p className="text-muted-foreground text-center text-xs mb-3">Preencha os dados e retornamos em breve.</p>
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
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base md:text-lg py-5 md:py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          "Enviando..."
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Enviar
          </>
        )}
      </Button>
      {feedback && (
        <div className={`text-sm text-center p-3 rounded-lg ${feedback.type === "error" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}>
          {feedback.text}
        </div>
      )}
    </form>
  );
}
