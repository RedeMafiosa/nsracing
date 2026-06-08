import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Headphones, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function Suporte() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await supabase.from('support_tickets').insert(form);
    setSending(false);
    setSent(true);
    toast({ title: 'Mensagem enviada!', description: 'Vamos responder o mais rápido possível.' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Suporte <span className="text-primary neon-text-sm">NsRacing</span>
            </h1>
            <p className="text-sm text-muted-foreground">Estamos aqui para te ajudar</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2 space-y-6">
          <div className="bg-card border border-primary/10 rounded-2xl p-6 neon-border">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Contactos</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div><p className="text-sm font-medium">Email</p><p className="text-xs text-muted-foreground">suporte@nsracing.com</p></div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                <div><p className="text-sm font-medium">Discord</p><p className="text-xs text-muted-foreground">discord.gg/nsracing</p></div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-primary/10 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">FAQ</h3>
            <div className="space-y-3">
              {[
                { q: 'Como me registo?', a: 'Clica em "Registar" no menu e preenche os teus dados.' },
                { q: 'Como vejo as lives?', a: 'Vai à página "Lives" após fazeres login para ver todas as transmissões.' },
                { q: 'Posso adicionar a minha live?', a: 'Sim! Contacta-nos pelo formulário ao lado ou pelo Discord.' },
                { q: 'É gratuito?', a: 'Sim, o NsRacing é totalmente gratuito para todos os membros.' },
              ].map((item, i) => (
                <div key={i} className="border-b border-primary/5 pb-3 last:border-0">
                  <p className="text-sm font-medium text-foreground">{item.q}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-3">
          <div className="bg-card border border-primary/10 rounded-2xl p-6 sm:p-8 neon-border">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">Envia-nos uma mensagem</h3>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-display text-xl font-bold text-foreground">Mensagem Enviada!</h4>
                <p className="text-sm text-muted-foreground mt-2">Obrigado pelo teu contacto. Vamos responder brevemente.</p>
                <Button className="mt-6" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-display">Nome</Label>
                    <Input id="name" placeholder="O teu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-secondary/50 border-primary/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-display">Email</Label>
                    <Input id="email" type="email" placeholder="teu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-secondary/50 border-primary/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-display">Assunto</Label>
                  <Input id="subject" placeholder="Assunto da mensagem" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="bg-secondary/50 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-display">Mensagem</Label>
                  <Textarea id="message" placeholder="Escreve aqui a tua mensagem..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="bg-secondary/50 border-primary/10 resize-none" />
                </div>
                <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground hover:bg-primary/80 neon-border font-display tracking-wide">
                  {sending ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Send className="w-4 h-4 mr-2" />Enviar Mensagem</>}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}