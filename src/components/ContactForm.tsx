import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, Send } from "lucide-react";

type Status = "idle" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (form: FormData) => {
    const errs: Record<string, string> = {};
    if (!form.get("name")) errs.name = "Ad soyad gerekli";
    const email = form.get("email") as string;
    if (!email) errs.email = "E-posta gerekli";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Geçerli bir e-posta girin";
    if (!form.get("subject")) errs.subject = "Konu seçin";
    if (!form.get("message")) errs.message = "Mesaj gerekli";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    console.log("Form submitted:", Object.fromEntries(form));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
        <CheckCircle className="h-12 w-12 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Mesajınız alınmıştır</h3>
        <p className="text-sm text-muted-foreground">Teşekkür ederiz, en kısa sürede dönüş yapacağız.</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Yeni mesaj gönder
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Bir hata oluştu, lütfen tekrar deneyin.
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" placeholder="Adınız Soyadınız" className="h-11 rounded-xl" />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" placeholder="ornek@email.com" className="h-11 rounded-xl" />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Konu</Label>
        <Select name="subject">
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Konu seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yanlis-bilgi">Yanlış bilgi</SelectItem>
            <SelectItem value="oneri">Öneri</SelectItem>
            <SelectItem value="genel">Genel soru</SelectItem>
          </SelectContent>
        </Select>
        {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Mesaj</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Lütfen eczane adı, il/ilçe ve tarih bilgisini mümkün olduğunca net belirtin."
          rows={5}
          className="rounded-xl resize-none"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" className="h-12 rounded-xl gap-2">
        <Send className="h-4 w-4" />
        Gönder
      </Button>
    </form>
  );
}
