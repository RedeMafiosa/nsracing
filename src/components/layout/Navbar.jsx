import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Archive, Headphones, LogOut, User, Menu, X, Crown } from 'lucide-react';
import { useSupabaseAuth as useAuth } from '@/lib/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Casa', icon: Home, requiresAuth: false },
  { path: '/lives', label: 'Lives', icon: Radio, requiresAuth: true },
  { path: '/arquivo', label: 'Arquivo', icon: Archive, requiresAuth: true },
  { path: '/suporte', label: 'Suporte', icon: Headphones, requiresAuth: true },
];

export default function Navbar({ user }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 neon-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-primary neon-text-sm tracking-wider">NsRacing</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLocked = item.requiresAuth && !user;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={isLocked ? '/login' : item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-primary/10 text-primary neon-text-sm border border-primary/30' :
                    isLocked ? 'text-muted-foreground/50 hover:text-muted-foreground' :
                    'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isLocked && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">🔒</span>}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {(user.role === 'admin' || user.role === 'sub') && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                    <Crown className="w-3 h-3" /> Admin
                  </Link>
                )}
                <Link to="/perfil" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 overflow-hidden flex items-center justify-center">
                    {user.avatar_url
                      ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <User className="w-4 h-4 text-primary" />
                    }
                  </div>
                  <span className="font-medium">{user.full_name || user.email}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Entrar</Button></Link>
                <Link to="/register"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/80 neon-border">Registar</Button></Link>
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-primary/10 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLocked = item.requiresAuth && !user;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={isLocked ? '/login' : item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-primary/10 text-primary border border-primary/30' :
                    isLocked ? 'text-muted-foreground/50' :
                    'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isLocked && <span className="ml-auto text-xs">🔒</span>}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-primary/10">
              {user ? (
                <>
                  <Link to="/perfil" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-primary">
                    <User className="w-5 h-5" /> Perfil
                  </Link>
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full">
                    <LogOut className="w-5 h-5" /> Sair
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full border-primary/30 text-primary">Entrar</Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">Registar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}