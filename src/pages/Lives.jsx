import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiveCard from '../components/lives/LiveCard';

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'formula1', label: 'F1' },
  { value: 'rally', label: 'Rally' },
  { value: 'gt', label: 'GT' },
  { value: 'nascar', label: 'NASCAR' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'drift', label: 'Drift' },
];

export default function Lives() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  const { data: streams = [], isLoading } = useQuery({
    queryKey: ['live-streams'],
    queryFn: async () => {
      const { data } = await supabase.from('live_streams').select('*').order('viewers', { ascending: false }).limit(50);
      return data || [];
    },
  });

 const filtered = (streams || []).filter((s) => {
    const catMatch = activeCategory === 'all' || s.category === activeCategory;
    const liveMatch = !showLiveOnly || s.is_live;
    return catMatch && liveMatch;
  });

 const liveCount = (streams || []).filter(s => s.is_live).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Lives <span className="text-primary neon-text-sm">Racing</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {liveCount > 0 ? `${liveCount} ao vivo agora` : 'Nenhuma live ao vivo'} · {streams.length} canais
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="bg-secondary/50 border border-primary/10">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}
                className="text-xs font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <button
          onClick={() => setShowLiveOnly(!showLiveOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            showLiveOnly ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-secondary/50 text-muted-foreground border-primary/10 hover:border-primary/20'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showLiveOnly ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'}`} />
          Ao Vivo
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-primary/10 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-secondary" />
              <div className="p-4 space-y-3"><div className="h-4 bg-secondary rounded w-3/4" /><div className="h-3 bg-secondary rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Radio className="w-16 h-16 text-primary/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-display">Nenhuma live encontrada</p>
          <p className="text-xs text-muted-foreground mt-1">Tenta mudar os filtros ou volta mais tarde</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((stream, i) => <LiveCard key={stream.id} stream={stream} index={i} />)}
        </div>
      )}
    </div>
  );
}
