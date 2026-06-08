import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError('Email ou palavra-passe incorretos.');
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <AuthLayout
      icon={<LogIn className="w-6 h-6 text-primary" />}
      title="Entrar"
      subtitle="Acede à tua conta NsRacing"
      footer={
        <p className="text-sm text-muted-foreground">
          Não tens conta?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">Registar</Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-display">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="teu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/50 border-primary/10"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-display">Palavra-passe</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Esqueceste?</Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            : 'Entrar'
          }
        </Button>
      </form>
    </AuthLayout>
  );
}