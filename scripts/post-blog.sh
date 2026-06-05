#!/bin/bash

# Wait for server to be ready
echo "Waiting for dev server..."
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  echo "Still waiting... ($i/30)"
  sleep 2
done

# Post the blog
echo "Publishing blog post..."
curl -X POST "http://localhost:3000/api/internal/publish-blog" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "faster-smoother-asix-live-june-2026",
    "title": "A Faster, Smoother Asix.live — June 5, 2026",
    "description": "Loading skeletons, smarter caching, and a better experience across all four apps. Here'\''s what shipped today.",
    "content": "We shipped a round of improvements across all four Asix.live apps today. Nothing flashy. Just the kind of work that makes everything feel more solid and polished.\n\n**Ascend** now shows a smooth loading animation while your habits and progress data loads in. Before today, the app would show a blank screen for a second or two on startup. That'\''s gone. The skeleton screen that appears now matches the real layout, so the transition into your data feels seamless instead of jarring.\n\n**GeoIntel** got a significant speed boost. The main crisis feed (the data that powers the globe) was hitting the database on every single request. We added a caching layer that stores that data for up to 90 seconds before refreshing. For most users, this means the globe loads almost instantly instead of waiting on a database round-trip. The cache also knows to clear itself the moment new intelligence data comes in, so you'\''ll never see stale information. As usage scales, we can distribute this cache across multiple servers without slowing down the globe view.\n\n**Portfolio** got the same treatment on the dashboard. The old loading experience was a spinning circle in the middle of a dark screen. Today we replaced that with a proper skeleton that looks like your actual subscriptions and app cards, just greyed out and animated. It'\''s a small thing, but it makes the dashboard feel like a real product.\n\n**WikiHole** already had a skeleton loader built in. We confirmed it'\''s wired up and working correctly. Article loads feel fast and intentional rather than broken.\n\nThese are the kinds of updates that don'\''t make headlines but make a real difference to people who use the apps every day. More to come tomorrow.",
    "author": "Kenzie",
    "cover_image": null,
    "tags": ["updates", "ascend", "wikihole", "geointel", "portfolio"],
    "published": true,
    "featured": false
  }'

echo ""
echo "✓ Blog post published!"
