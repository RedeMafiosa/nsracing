import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Eye, Radio, Trophy, ExternalLink } from 'lucide-react';

const platformColors = {
  twitch: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  youtube: 'bg-red-500/15 text-red-400 border-red-500/25',
  kick: 'bg-green-500/15 text-green-400 border-green-500/25',
};

const categoryLabels = {
  formula1: 'F1',
  rally: 'Rally',
  gt: 'GT',
  nascar: 'NASCAR',
  endurance: 'Endurance',
  drift: 'Drift',
  other: 'Outros',
};

export default function LiveCard({ stream, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group bg-card border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:neon-border transition-all duration-500"
    >
      {/* Thumbnail / Embed area */}
      <div className="relative aspect-video bg-secondary overflow-hidden">
        {stream.thumbnail_url ? (
          <img src={stream.thumbnail_url} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
            <Radio className="w-12 h-12 text-primary/30" />
          </div>
        )}
        
        {/* Live badge */}
        {stream.is_live && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-600 text-white border-0 animate-pulse-neon font-display text-[10px] tracking-wider px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 inline-block" />
              AO VIVO
            </Badge>
          </div>
        )}

        {/* Rank */}
        {stream.rank > 0 && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-background/90 border border-primary/30 flex items-center justify-center">
            <span className="font-display text-xs font-bold text-primary">#{stream.rank}</span>
          </div>
        )}

        {/* Viewers */}
        {stream.viewers > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <Eye className="w-3 h-3 text-primary" />
            <span className="text-[11px] font-medium text-foreground">{stream.viewers.toLocaleString('pt-PT')}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {stream.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{stream.streamer_name}</p>
          </div>
          {stream.channel_url && (
            <a href={stream.channel_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className={`text-[10px] ${platformColors[stream.platform] || platformColors.twitch}`}>
            {stream.platform?.toUpperCase() || 'TWITCH'}
          </Badge>
          {stream.category && (
            <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
              {categoryLabels[stream.category] || stream.category}
            </Badge>
          )}
        </div>

        {stream.description && (
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{stream.description}</p>
        )}
      </div>
    </motion.div>
  );
}