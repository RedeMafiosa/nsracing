import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth as useAuth } from '@/lib/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { Crown, Star, Shield, Search, Save, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';

const CARGOS = [
  { label: 'Nenhum', value: '', icon: '' },
  { label: 'Mais Ativo', value: 'Mais Ativo', icon: '🔥' },
  { label: 'Maior Doador', value: 'Maior Doador', icon: '❤️' },
  { label: 'Campeão', value: 'Campeão', icon: '🏆' },
  { label: 'VIP', value: 'VIP', icon: '💎' },
  { label: 'Moderador', value: 'Moderador', icon: '🎖️' },
  { label: 'Destaque', value: 'Destaque', icon: '⚡' },
  { label: 'Lenda', value: 'Lenda', icon: '👑' },
  { label: 'Super Fã', value: 'Super Fã', icon: '🌟' },
];

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s === value ? 0 : s)}
          className={`text-xl transition-transform hover:scale-125 ${s <= value ? 'text-amber-400' : 'text-muted-foreground/30'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function MemberRow({ member, onSave }) {
  const [cargo, setCargo] = useState(member.cargo || '');
  const [cargoIcon, setCargoIcon] = useState(member.cargo_icon || '');
  const [stars, setStars] = useState(member.stars || 0);
  const [role, setRole] = useState(member.role || 'user');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleCargoSelect = (c) => {
    setCargo(c.value);
    setCargoIcon(c.icon);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ cargo, cargo_icon: cargoIcon, stars, role }).eq('id', member.id);
    setSaving(false);
    toast({ title: 'Membro atualizado!', description: `${member.full_name || member.email} foi atualizado.` });
    onSave();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-primary/10 rounded-xl p-4 sm:p-5 neon-border"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/30 flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
            {member.avatar_url
              ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
              : <span className="font-display text-xl font-black text-primary">{(member.full_name || member.email || '?')[0].toUpperCase()}</span>
            }
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-sm">{member.full_name || 'Sem nome'}</p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
            {member.cargo && <span className="text-xs text-amber-400">{member.cargo_icon} {member.cargo}</span>}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-display text-muted-foreground">Papel</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-sm bg-secondary/50 border border-primary/10 rounded-lg px-2 py-1.5 text-foreground"
            >
              <option value="user">Membro</option>
              <option value="sub">Sub</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display text-muted-foreground">Cargo</Label>
            <select
              value={cargo}
              onChange={(e) => {
                const found = CARGOS.find(c => c.value === e.target.value);
                if (found) handleCargoSelect(found);
              }}
              className="w-full text-sm bg-secondary/50 border border-primary/10 rounded-lg px-2 py-1.5 text-foreground"
            >
              {CARGOS.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display text-muted-foreground">Estrelas</Label>
            <StarPicker value={stars} onChange={setStars} />
          </div>
        </div>

        <div className="flex items-end">
          <Button size="sm" onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/80 neon-border font-display w-full sm:w-auto">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-3 h-3 mr-1" />Guardar</>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'sub')) {
    return <Navigate to="/" replace />;
  }

  const filtered = members.filter(m =>
    (m.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Gestão de Membros</h1>
            <p className="text-sm text-muted-foreground">{members.length} membros registados</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar membro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-primary/10"
          />
        </div>

        <div className="space-y-3">
          {filtered.map(member => (
            <MemberRow key={member.id} member={member} onSave={loadData} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Nenhum membro encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}