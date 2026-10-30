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
  siClaude,
  siOpencode,
  siPostman,
} from 'simple-icons';

interface Logo {
  path: string;
  hex: string;
}

const LOGOS: Record<string, Logo> = {
  Angular: { path: siAngular.path, hex: siAngular.hex },
  React: { path: siReact.path, hex: siReact.hex },
  'Next.js': { path: siNextdotjs.path, hex: siNextdotjs.hex },
  TypeScript: { path: siTypescript.path, hex: siTypescript.hex },
  'Tailwind CSS': { path: siTailwindcss.path, hex: siTailwindcss.hex },
  'Node.js': { path: siNodedotjs.path, hex: siNodedotjs.hex },
  Vite: { path: siVite.path, hex: siVite.hex },
  HTML5: { path: siHtml5.path, hex: siHtml5.hex },
  CSS3: { path: siCss.path, hex: siCss.hex },
  Go: { path: siGo.path, hex: siGo.hex },
  GitHub: { path: siGithub.path, hex: siGithub.hex },
  Git: { path: siGit.path, hex: siGit.hex },
  Linux: { path: siLinux.path, hex: siLinux.hex },
  Docker: { path: siDocker.path, hex: siDocker.hex },
  'Claude Code': { path: siClaude.path, hex: siClaude.hex },
  OpenCode: { path: siOpencode.path, hex: siOpencode.hex },
  Postman: { path: siPostman.path, hex: siPostman.hex },
};

export function TechLogo({
  name,
  colored = false,
  className = 'h-5 w-5',
}: {
  name: string;
  colored?: boolean;
  className?: string;
}) {
  const logo = LOGOS[name];
  if (logo) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill={colored ? `#${logo.hex}` : 'currentColor'} aria-hidden="true">
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
