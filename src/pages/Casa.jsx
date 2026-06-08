import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NeonTitle from '@/components/home/NeonTitle';
import StatsCounter from '@/components/home/StatsCounter';
import MembersList from '@/components/home/MembersList';

export default function Casa() {
  const { data: members = [] } = useQuery({
    queryKey: ['members-home'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id, full_name, email, avatar_url, role, cargo, cargo_icon').order('created_at', { ascending: false }).limit(12);
      return data || [];
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 neon-glow-bg pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-background/70" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <NeonTitle />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/80 neon-border font-display tracking-wider px-8">
                Juntar-me
              </Button>
            </Link>
            <Link to="/lives">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-display tracking-wider px-8">
                <Radio className="w-4 h-4 mr-2" /> Ver Lives
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              A <span className="text-primary neon-text-sm">Comunidade</span> do Motorsport Virtual
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              NsRacing é o lar dos apaixonados por sim racing. Acompanha as melhores lives, revê os momentos épicos e faz parte de uma comunidade que vive para a velocidade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <StatsCounter userCount={members.length} />
        </div>
      </section>

      {/* Members */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Os Nossos <span className="text-primary neon-text-sm">Pilotos</span>
            </h2>
            <p className="text-muted-foreground mt-2">{members.length} membros na comunidade</p>
          </motion.div>
          <MembersList members={members} />
          <div className="text-center mt-8">
            <Link to="/register">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-display">
                Junta-te a nós <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}