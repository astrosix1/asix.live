import { PROJECTS } from './project-config';

export function getProject(slug: string) {
  const project = Object.values(PROJECTS).find((p) => p.slug === slug);
  return project;
}

export function getProjectList() {
  return Object.values(PROJECTS);
}
