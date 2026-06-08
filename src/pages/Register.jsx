import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { UserPlus, CheckCircle } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setDone(true);
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        icon={<CheckCircle className="w-6 h-6 text-green-500" />}
        title="Confirma o teu email"
        subtitle="Enviámos um link de confirmação para o teu email."
        footer={
          <Link to="/login" className="text-primary hover:underline text-sm">Voltar ao login</Link>
        }
      >
        <p className="text-sm text-muted-foreground text-center">
          Verifica a tua caixa de entrada e clica no link para ativar a conta.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<UserPlus className="w-6 h-6 text-primary" />}
      title="Criar Conta"
      subtitle="Junta-te à comunidade NsRacing"
      footer={
        <p className="text-sm text-muted-foreground">
          Já tens conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs font-display">Nome</Label>
          <Input
            placeholder="O teu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-secondary/50 border-primary/10"
          />
        </div>
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
        <div className="space-y-2">
          <Label className="text-xs font-display">Palavra-passe</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-secondary/50 border-primary/10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-display">Confirmar Palavra-passe</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            : 'Criar Conta'
          }
        </Button>
      </form>
    </AuthLayout>
  );
}