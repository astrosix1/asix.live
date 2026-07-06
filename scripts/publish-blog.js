#!/usr/bin/env node
/**
 * Reusable blog post publisher — inserts a row into the `blog_posts` table
 * using the Supabase service role key (bypasses RLS, so keep this local/CI-only).
 *
 * Usage:
 *   node scripts/publish-blog.js post.json
 *   cat post.json | node scripts/publish-blog.js
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (or set them as shell env vars before running).
 *
 * Expected JSON shape (matches the blog_posts table / BlogPost type):
 *   {
 *     "slug": "my-post-slug",
 *     "title": "Post Title",
 *     "description": "One-line summary shown in the blog list.",
 *     "author": "Nick Collins",
 *     "cover_image": null,
 *     "tags": ["updates"],
 *     "published": true,
 *     "featured": false,
 *     "content": "Full markdown body..."
 *   }
 *
 * Required fields: slug, title, description, author, content.
 * Optional fields (defaulted if omitted): cover_image (null), tags ([]),
 * published (true), featured (false).
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually (Node doesn't load it automatically)
try {
  const env = readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2].replace(/^"|"$/g, '');
  }
} catch { /* no .env.local — use shell env vars */ }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

const REQUIRED_FIELDS = ['slug', 'title', 'description', 'author', 'content'];

function validate(post) {
  const missing = REQUIRED_FIELDS.filter((field) => !post[field]);
  if (missing.length > 0) {
    throw new Error(`Post is missing required field(s): ${missing.join(', ')}`);
  }
}

async function loadPost() {
  const filePath = process.argv[2];
  const raw = filePath ? readFileSync(filePath, 'utf8') : await readStdin();

  if (!raw || !raw.trim()) {
    throw new Error(
      'No post data provided. Usage: node scripts/publish-blog.js post.json (or pipe JSON via stdin).'
    );
  }

  let post;
  try {
    post = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON input: ${err.message}`);
  }

  validate(post);

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    author: post.author,
    cover_image: post.cover_image ?? null,
    tags: post.tags ?? [],
    published: post.published ?? true,
    featured: post.featured ?? false,
    content: post.content,
  };
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const post = await loadPost();

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select('id, slug')
    .single();

  if (error) {
    console.error('Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`Published: https://asix.live/blog/${data.slug} (id: ${data.id})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
