/**
 * Configuration for project subdomains
 * Maps subdomain names to project URLs
 */
export const projectSubdomains: Record<string, {
  name: string;
  url: string;
  description: string;
}> = {
  ascend: {
    name: "Ascend",
    url: "https://ascend.asix.live/",
    description: "Habit tracking and wellness app",
  },
  eventglobe: {
    name: "Event Globe",
    url: "https://event-globe-url.vercel.app/", // Update with actual Event Globe URL
    description: "Geopolitical intelligence platform",
  },
  "event-globe": {
    name: "Event Globe",
    url: "https://event-globe-url.vercel.app/", // Update with actual Event Globe URL
    description: "Geopolitical intelligence platform",
  },
};

export function getProjectBySubdomain(subdomain: string | null) {
  if (!subdomain) return null;
  return projectSubdomains[subdomain] || null;
}
