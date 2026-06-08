import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Calendar, Trophy, ExternalLink, Play } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const medalColors = {
  1: 'from-amber-400 to-amber-600',
  2: 'from-slate-300 to-slate-500',
  3: 'from-orange-600 to-orange-800',
};

export default function ArchivedCard({ stream, index }) {
  const rank = stream.rank_position || index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group flex flex-col sm:flex-row gap-4 bg-card border border-primary/10 rounded-2xl p-4 hover:border-primary/30 hover:neon-border transition-all duration-500"
    >
      {/* Rank Badge */}
      <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-1 sm:w-16 flex-shrink-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg ${
          rank <= 3 
            ? `bg-gradient-to-br ${medalColors[rank] || medalColors[3]} text-black` 
            : 'bg-primary/10 border border-primary/20 text-primary'
        }`}>
          {rank <= 3 ? <Trophy className="w-5 h-5" /> : `#${rank}`}
        </div>
        {rank <= 3 && <span className="text-[10px] font-display font-bold text-muted-foreground">#{rank}</span>}
      </div>

      {/* Thumbnail */}
      <div className="relative w-full sm:w-48 aspect-video sm:aspect-auto sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
        {stream.thumbnail_url ? (
          <img src={stream.thumbnail_url} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {stream.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{stream.streamer_name}</p>
          {stream.description && (
            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{stream.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="flex items-center gap-1 text-[11px] text-primary">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-semibold">{(stream.views || 0).toLocaleString('pt-PT')}</span>
            <span className="text-muted-foreground">views</span>
          </div>
          {stream.duration && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {stream.duration}
            </div>
          )}
          {stream.stream_date && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(new Date(stream.stream_date), 'dd MMM yyyy', { locale: pt })}
            </div>
          )}
          <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 ml-auto">
            {stream.platform?.toUpperCase() || 'TWITCH'}
          </Badge>
          {stream.video_url && (
            <a href={stream.video_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}