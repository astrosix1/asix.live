import { headers } from 'next/headers';
import { projectSubdomains } from './project-subdomains';

export async function getSubdomain(): Promise<string | null> {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');
  return subdomain === 'main' ? null : subdomain;
}

/**
 * Check if current request is for a project subdomain
 * Returns the project name (subdomain) or null if on main domain
 */
export async function getProjectSubdomain(): Promise<string | null> {
  const subdomain = await getSubdomain();
  // Check if subdomain is a registered project
  return subdomain && projectSubdomains[subdomain] ? subdomain : null;
}
