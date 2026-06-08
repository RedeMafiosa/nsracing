import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth as useAuth } from '@/lib/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Crown, Save, Camera, Star, ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

function StarDisplay({ count }) {
  if (!count || count === 0) return null;
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-sm ${s <= count ? 'text-amber-400' : 'text-muted-foreground/20'}`}>★</span>
      ))}
    </div>
  );
}

export default function Perfil() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [bio, setBio] = useState('');
  const [favoriteCategory, setFavoriteCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setFavoriteCategory(user.favorite_category || '');
    }
  }, [user]);

  const uploadFile = async (file, path) => {
    const ext = file.name.split('.').pop();
    const fileName = `${path}/${user.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ bio, favorite_category: favoriteCategory }).eq('id', user.id);
    await refreshUser();
    setSaving(false);
    toast({ title: 'Perfil atualizado!', description: 'As tuas alterações foram guardadas.' });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const url = await uploadFile(file, 'avatars');
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
    await refreshUser();
    setUploadingAvatar(false);
    toast({ title: 'Foto atualizada!' });
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    const url = await uploadFile(file, 'banners');
    await supabase.from('profiles').update({ banner_url: url }).eq('id', user.id);
    await refreshUser();
    setUploadingBanner(false);
    toast({ title: 'Capa atualizada!' });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (user.full_name || user.email || '?')[0].toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Profile Card */}
        <div className="bg-card border border-primary/10 rounded-2xl neon-border overflow-hidden">

          {/* BANNER */}
          <div
            className="relative w-full h-36 sm:h-48 group cursor-pointer"
            style={{
              background: user.banner_url
                ? `url(${user.banner_url}) center/cover no-repeat`
                : 'linear-gradient(135deg, #0a1628 0%, #0d2240 40%, #071520 100%)',
              borderBottom: '1px solid rgba(0,207,255,0.15)',
            }}
            onClick={() => bannerInputRef.current?.click()}
          >
            {!user.banner_url && (
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,207,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {uploadingBanner
                ? <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><ImagePlus className="w-5 h-5 text-white" /><span className="text-white text-sm font-semibold">Alterar foto de capa</span></>
              }
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-white/20 text-white text-xs font-medium hover:bg-black/70 transition-all backdrop-blur-sm"
            >
              <Camera className="w-3 h-3" /> Editar capa
            </button>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </div>

          {/* AVATAR + INFO */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="relative -mt-12 mb-4 flex items-end gap-4">
              <div className="relative group flex-shrink-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-card overflow-hidden flex items-center justify-center cursor-pointer"
                  style={{
                    background: user.avatar_url
                      ? `url(${user.avatar_url}) center/cover no-repeat`
                      : 'linear-gradient(135deg, rgba(0,207,255,0.35), rgba(0,207,255,0.08))',
                  }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {!user.avatar_url && (
                    <span className="font-display text-3xl font-black text-primary">{initials}</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingAvatar
                      ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <Camera className="w-5 h-5 text-white" />
                    }
                  </div>
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary border-2 border-card flex items-center justify-center hover:bg-primary/80 transition-colors"
                >
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {user.full_name || 'Piloto Anónimo'}
              </h1>
              {user.cargo && (
                <p className="text-sm font-semibold text-amber-400 mt-0.5">{user.cargo_icon} {user.cargo}</p>
              )}
              <div className="mt-1"><StarDisplay count={user.stars} /></div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" />{user.email}
                </div>
                {user.created_date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Desde {format(new Date(user.created_date), 'MMM yyyy', { locale: pt })}
                  </div>
                )}
              </div>
              <div className="mt-3">
                {user.role === 'admin' ? (
                  <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25">
                    <Crown className="w-3 h-3 mr-1" /> Administrador
                  </Badge>
                ) : user.role === 'sub' ? (
                  <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/25">
                    <Star className="w-3 h-3 mr-1" /> Sub
                  </Badge>
                ) : (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Shield className="w-3 h-3 mr-1" /> Membro
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-card border border-primary/10 rounded-2xl p-6 sm:p-8 mt-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Editar Perfil</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-display">Bio</Label>
              <Input
                placeholder="Fala um pouco sobre ti..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-secondary/50 border-primary/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-display">Categoria Favorita</Label>
              <Input
                placeholder="Ex: Formula 1, Rally, GT..."
                value={favoriteCategory}
                onChange={(e) => setFavoriteCategory(e.target.value)}
                className="bg-secondary/50 border-primary/10"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/80 neon-border font-display">
              {saving
                ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : <><Save className="w-4 h-4 mr-2" />Guardar Alterações</>
              }
            </Button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}