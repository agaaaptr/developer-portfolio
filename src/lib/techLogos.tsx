import {
  siAngular,
  siReact,
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siNodedotjs,
  siVite,
  siHtml5,
  siCss,
  siGo,
  siGithub,
  siGit,
  siLinux,
  siDocker,
} from 'simple-icons';

const LOGOS: Record<string, { path: string }> = {
  Angular: siAngular,
  React: siReact,
  'Next.js': siNextdotjs,
  TypeScript: siTypescript,
  'Tailwind CSS': siTailwindcss,
  'Node.js': siNodedotjs,
  Vite: siVite,
  HTML5: siHtml5,
  CSS3: siCss,
  Go: siGo,
  GitHub: siGithub,
  Git: siGit,
  Linux: siLinux,
  Docker: siDocker,
};

export function TechLogo({ name }: { name: string }) {
  const logo = LOGOS[name];
  if (logo) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d={logo.path} />
      </svg>
    );
  }
  const mono = name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return <span className="font-mono text-xs font-bold">{mono}</span>;
}
