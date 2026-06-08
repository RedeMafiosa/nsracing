-- ============================================
-- NsRacing - Supabase Setup SQL
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. TABELA PROFILES (dados dos utilizadores)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  favorite_category TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'sub', 'admin')),
  cargo TEXT DEFAULT '',
  cargo_icon TEXT DEFAULT '',
  stars INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA LIVE_STREAMS
CREATE TABLE IF NOT EXISTS public.live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  streamer_name TEXT NOT NULL,
  platform TEXT DEFAULT 'twitch' CHECK (platform IN ('twitch', 'youtube', 'kick')),
  embed_url TEXT,
  channel_url TEXT,
  thumbnail_url TEXT,
  is_live BOOLEAN DEFAULT false,
  viewers INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  category TEXT DEFAULT 'formula1' CHECK (category IN ('formula1', 'rally', 'gt', 'nascar', 'endurance', 'drift', 'other')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA ARCHIVED_STREAMS
CREATE TABLE IF NOT EXISTS public.archived_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  streamer_name TEXT NOT NULL,
  platform TEXT DEFAULT 'twitch' CHECK (platform IN ('twitch', 'youtube', 'kick')),
  video_url TEXT,
  thumbnail_url TEXT,
  views INTEGER DEFAULT 0,
  duration TEXT,
  category TEXT DEFAULT 'formula1' CHECK (category IN ('formula1', 'rally', 'gt', 'nascar', 'endurance', 'drift', 'other')),
  rank_position INTEGER DEFAULT 0,
  stream_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA SUPPORT_TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRIGGER: criar profile automaticamente quando o user se regista
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archived_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles: todos podem ler, só o próprio utilizador (ou admin) pode editar
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Live Streams: todos podem ler; só admins podem criar/editar/apagar
CREATE POLICY "Live streams viewable by all" ON public.live_streams FOR SELECT USING (true);
CREATE POLICY "Admins manage live streams" ON public.live_streams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'sub'))
);

-- Archived Streams: todos podem ler; só admins podem criar/editar/apagar
CREATE POLICY "Archived streams viewable by all" ON public.archived_streams FOR SELECT USING (true);
CREATE POLICY "Admins manage archived streams" ON public.archived_streams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'sub'))
);

-- Support Tickets: utilizadores autenticados podem criar; admins podem ver todos
CREATE POLICY "Anyone can create support ticket" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view support tickets" ON public.support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'sub'))
);

-- 7. STORAGE BUCKET para avatares e banners
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);