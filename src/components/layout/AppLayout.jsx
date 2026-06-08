import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useSupabaseAuth as useAuth } from '@/lib/SupabaseAuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="pt-16">
        <Outlet context={{ user }} />
      </main>
      <footer className="border-t border-primary/10 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-display text-primary neon-text-sm text-sm tracking-widest">NsRacing</p>
          <p className="text-xs text-muted-foreground mt-2">© 2025 NsRacing. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}