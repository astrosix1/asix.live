// Screenshot galleries per app. width/height are the source PNGs' actual pixel
// dimensions — next/image needs them to compute the aspect ratio and avoid
// layout shift when the images are displayed smaller than their native size.
export interface AppScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const SCREENSHOTS: Record<'ascend' | 'geointel' | 'wikihole', AppScreenshot[]> = {
  ascend: [
    { src: '/images/projects/ascend-dashboard.png', alt: 'Ascend Dashboard', width: 1917, height: 650 },
    { src: '/images/projects/ascend-events.png', alt: 'Ascend Discover Events', width: 1617, height: 816 },
    { src: '/images/projects/ascend-graphs.png', alt: 'Ascend Progress Graphs', width: 1616, height: 817 },
    { src: '/images/projects/ascend-timer.png', alt: 'Ascend Pomodoro Timer', width: 1617, height: 817 },
  ],
  geointel: [
    { src: '/images/projects/geointel-dashboard.png', alt: 'GeoIntel Dashboard', width: 1920, height: 913 },
    { src: '/images/projects/geointel-brief.png', alt: 'GeoIntel Brief', width: 905, height: 906 },
    { src: '/images/projects/geointel-forecast.png', alt: 'GeoIntel Forecast', width: 1547, height: 898 },
    { src: '/images/projects/geointel-relationships.png', alt: 'GeoIntel Relationships', width: 1551, height: 746 },
    { src: '/images/projects/geointel-trend.png', alt: 'GeoIntel Trend', width: 356, height: 352 },
  ],
  wikihole: [
    { src: '/images/projects/wikihole-article.png', alt: 'WikiHole article with related rabbit holes', width: 1917, height: 887 },
    { src: '/images/projects/wikihole-discover.png', alt: 'WikiHole Discover page', width: 1917, height: 887 },
    { src: '/images/projects/wikihole-quiz.png', alt: 'WikiHole quiz', width: 1917, height: 887 },
  ],
};
