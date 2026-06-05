const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const post = {
  slug: 'faster-smoother-asix-live-june-2026',
  title: 'A Faster, Smoother Asix.live — June 5, 2026',
  description: 'Loading skeletons, smarter caching, and a better experience across all four apps. Here\'s what shipped today.',
  content: `We shipped a round of improvements across all four Asix.live apps today. Nothing flashy. Just the kind of work that makes everything feel more solid and polished.

**Ascend** now shows a smooth loading animation while your habits and progress data loads in. Before today, the app would show a blank screen for a second or two on startup. That's gone. The skeleton screen that appears now matches the real layout, so the transition into your data feels seamless instead of jarring.

**GeoIntel** got a significant speed boost. The main crisis feed (the data that powers the globe) was hitting the database on every single request. We added a caching layer that stores that data for up to 90 seconds before refreshing. For most users, this means the globe loads almost instantly instead of waiting on a database round-trip. The cache also knows to clear itself the moment new intelligence data comes in, so you'll never see stale information. As usage scales, we can distribute this cache across multiple servers without slowing down the globe view.

**Portfolio** got the same treatment on the dashboard. The old loading experience was a spinning circle in the middle of a dark screen. Today we replaced that with a proper skeleton that looks like your actual subscriptions and app cards, just greyed out and animated. It's a small thing, but it makes the dashboard feel like a real product.

**WikiHole** already had a skeleton loader built in. We confirmed it's wired up and working correctly. Article loads feel fast and intentional rather than broken.

These are the kinds of updates that don't make headlines but make a real difference to people who use the apps every day. More to come tomorrow.`,
  author: 'Kenzie',
  cover_image: null,
  tags: ['updates', 'ascend', 'wikihole', 'geointel', 'portfolio'],
  published: true,
  featured: false,
};

async function publishPost() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    console.log('✓ Blog post published:', data.id);
    console.log('URL: https://asix.live/blog/' + data.slug);
  } catch (err) {
    console.error('Failed to publish:', err.message);
    process.exit(1);
  }
}

publishPost();
