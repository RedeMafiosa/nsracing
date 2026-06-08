import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { KeyRound, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('Mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });

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
        title="Palavra-passe Alterada!"
        subtitle="A tua palavra-passe foi atualizada com sucesso."
        footer={<Link to="/login" className="text-primary hover:underline text-sm">Ir para o login</Link>}
      >
        <p className="text-sm text-muted-foreground text-center">Podes agora entrar com a tua nova palavra-passe.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<KeyRound className="w-6 h-6 text-primary" />}
      title="Nova Palavra-passe"
      subtitle="Define uma nova palavra-passe para a tua conta"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs font-display">Nova Palavra-passe</Label>
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
            : 'Guardar Nova Palavra-passe'
          }
        </Button>
      </form>
    </AuthLayout>
  );
}