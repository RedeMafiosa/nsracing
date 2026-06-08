import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Archive, Trophy } from 'lucide-react';
import ArchivedCard from '../components/arquivo/ArchivedCard';

export default function Arquivo() {
  const { data: archived = [], isLoading } = useQuery({
    queryKey: ['archived-streams'],
    queryFn: async () => {
      const { data } = await supabase.from('archived_streams').select('*').order('views', { ascending: false }).limit(10);
      return data || [];
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Archive className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Arquivo <span className="text-primary neon-text-sm">Top 10</span>
            </h1>
            <p className="text-sm text-muted-foreground">As lives mais vistas de sempre</p>
          </div>
        </div>
      </motion.div>

      {archived.length >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-10">
          {[1, 0, 2].map((idx) => {
            const stream = archived[idx];
            if (!stream) return null;
            const isFirst = idx === 0;
            return (
              <div key={stream.id} className={`bg-card border rounded-2xl p-4 text-center ${isFirst ? 'border-amber-500/30 neon-border-strong sm:-mt-4' : 'border-primary/10 neon-border'}`}>
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center font-display font-black mb-3 ${
                  idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' :
                  idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-black' :
                  'bg-gradient-to-br from-orange-600 to-orange-800 text-white'
                }`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="font-display text-xs text-muted-foreground mb-1">#{idx + 1}</p>
                <p className="font-semibold text-xs text-foreground truncate">{stream.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stream.streamer_name}</p>
                <p className="text-primary font-display font-bold text-sm mt-2">{(stream.views || 0).toLocaleString('pt-PT')} views</p>
              </div>
            );
          })}
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-primary/10 rounded-2xl p-4 animate-pulse">
              <div className="flex gap-4"><div className="w-16 h-10 bg-secondary rounded" /><div className="flex-1 space-y-2"><div className="h-4 bg-secondary rounded w-3/4" /><div className="h-3 bg-secondary rounded w-1/2" /></div></div>
            </div>
          ))}
        </div>
      ) : archived.length === 0 ? (
        <div className="text-center py-20">
          <Archive className="w-16 h-16 text-primary/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-display">Nenhum arquivo disponível</p>
        </div>
      ) : (
        <div className="space-y-4">
          {archived.map((stream, i) => <ArchivedCard key={stream.id} stream={stream} index={i} />)}
        </div>
      )}
    </div>
  );
}