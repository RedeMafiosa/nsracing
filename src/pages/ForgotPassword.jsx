import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { KeyRound, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout
        icon={<CheckCircle className="w-6 h-6 text-green-500" />}
        title="Email Enviado"
        subtitle="Verifica a tua caixa de entrada."
        footer={<Link to="/login" className="text-primary hover:underline text-sm">Voltar ao login</Link>}
      >
        <p className="text-sm text-muted-foreground text-center">
          Se o email existir na nossa base de dados, receberás um link para redefinir a palavra-passe.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<KeyRound className="w-6 h-6 text-primary" />}
      title="Recuperar Conta"
      subtitle="Envia-te um link para redefinir a palavra-passe"
      footer={<Link to="/login" className="text-primary hover:underline text-sm">Voltar ao login</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-display">Email</Label>
          <Input
            type="email"
            placeholder="teu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/50 border-primary/10"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 neon-border font-display"
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            : 'Enviar Link'
          }
        </Button>
      </form>
    </AuthLayout>
  );
}