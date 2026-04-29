import { headers } from 'next/headers';
import { projectSubdomains } from './project-subdomains';

export function getSubdomain(): string | null {
  const headersList = headers();
  const subdomain = headersList.get('x-subdomain');
  return subdomain === 'main' ? null : subdomain;
}

/**
 * Check if current request is for a project subdomain
 * Returns the project name (subdomain) or null if on main domain
 */
export function getProjectSubdomain(): string | null {
  const subdomain = getSubdomain();
  // Check if subdomain is a registered project
  return subdomain && projectSubdomains[subdomain] ? subdomain : null;
}
