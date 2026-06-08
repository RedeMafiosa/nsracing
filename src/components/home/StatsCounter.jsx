import React from 'react';
import { motion } from 'framer-motion';

export default function NeonTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center relative"
    >
      <motion.h1
        className="font-display font-black tracking-wider relative leading-none"
        style={{
          fontSize: 'clamp(2.8rem, 8vw, 7rem)',
          color: '#ffffff',
          textShadow:
            '0 0 8px #00cfff, 0 0 20px #00cfff, 0 0 40px #00a8e8, 0 0 80px #006fa8, 0 0 120px #003d6b',
          letterSpacing: '0.05em',
        }}
        animate={{
          textShadow: [
            '0 0 8px #00cfff, 0 0 20px #00cfff, 0 0 40px #00a8e8, 0 0 80px #006fa8',
            '0 0 14px #00e0ff, 0 0 30px #00cfff, 0 0 60px #00a8e8, 0 0 100px #006fa8',
            '0 0 8px #00cfff, 0 0 20px #00cfff, 0 0 40px #00a8e8, 0 0 80px #006fa8',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        RACING LIVE STREAMS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 max-w-2xl mx-auto leading-relaxed text-center"
        style={{ color: '#c8d4e0', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
      >
        Bem-vindo ao circuito digital. Aqui a velocidade encontra o sobrenatural.
        Lives de racing em direto, onde cada curva é espetáculo e cada reta uma explosão de adrenalina.
      </motion.p>
    </motion.div>
  );
}