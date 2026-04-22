export const PROJECTS = {
  ascend: {
    id: 'ascend',
    name: 'Ascend',
    slug: 'ascend',
    tagline: 'Replace addictions with hobbies',
    description:
      'A competitive app that helps you replace addictions with hobbies and track progress with friends.',
    longDescription:
      'Ascend is a social fitness app designed to help you break bad habits by building positive ones. Compete with friends, track your progress, and celebrate wins together.',
    icon: '🚀',
    color: '#3B82F6', // Blue
    image: '/images/projects/ascend.jpg',
    category: 'Social & Wellness',
    iframeUrl: null, // To be added when deployed
    externalUrl: null, // To be added
    features: [
      'Habit replacement tracking',
      'Competitive leaderboards',
      'Social challenges with friends',
      'Progress analytics',
      'Milestone celebrations',
    ],
  },
  geointel: {
    id: 'geointel',
    name: 'GeoIntel',
    slug: 'geointel',
    tagline: 'Live world events on a 3D globe',
    description:
      'An interactive globe displaying real-world events as they happen in real-time.',
    longDescription:
      'GeoIntel visualizes global events on an interactive 3D globe. Watch events unfold worldwide, explore event details, and understand global patterns through data visualization.',
    icon: '🌍',
    color: '#10B981', // Green
    image: '/images/projects/geointel.jpg',
    category: 'Data Visualization',
    iframeUrl: null,
    externalUrl: null,
    features: [
      '3D globe visualization',
      'Real-time event updates',
      'Interactive filtering',
      'Event details & analytics',
      'Historical event tracking',
    ],
  },
  heavyPocket: {
    id: 'heavy-pocket',
    name: 'Heavy Pocket',
    slug: 'heavy-pocket',
    tagline: 'Your CFO replacement',
    description:
      'Financial management and analysis tool providing CFO-level insights for personal and business finances.',
    longDescription:
      'Heavy Pocket brings enterprise-grade financial analysis to your personal finances. Get CFO-level insights into spending, forecasting, and financial health.',
    icon: '💼',
    color: '#F59E0B', // Amber
    image: '/images/projects/heavy-pocket.jpg',
    category: 'Finance',
    iframeUrl: null,
    externalUrl: null,
    features: [
      'Financial dashboards',
      'Budget forecasting',
      'Expense analytics',
      'Reporting & insights',
      'Cash flow analysis',
    ],
  },
} as const;

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com', icon: 'Github' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' },
  { name: 'Email', url: 'mailto:hello@asixstud.io', icon: 'Mail' },
];

export const SITE_CONFIG = {
  name: 'asixstud.io',
  description: 'A hub for innovative webapps and projects',
  domain: 'asixstud.io',
  author: 'asixstud',
};
