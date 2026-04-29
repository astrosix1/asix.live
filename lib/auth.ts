async function getSupabase() {
  const { supabase } = await import('./supabase');
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

export async function signUp(email: string, password: string) {
  const supabase = await getSupabase();
  return await supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  const supabase = await getSupabase();
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle() {
  const supabase = await getSupabase();
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
}

export async function signOut() {
  const supabase = await getSupabase();
  return await supabase.auth.signOut();
}

export async function getSession() {
  const supabase = await getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  const supabase = await getSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
