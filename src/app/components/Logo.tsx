import logoImage from 'figma:asset/716254238436a46e02a77ea53b823b6f1f74a633.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function Logo({ className = '', size = 'md', animated = false }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  return (
    <img 
      src={logoImage} 
      alt="PAKO - Blow bubbles, not your budget" 
      className={`w-auto ${sizeClasses[size]} ${animated ? 'animate-fade-in' : ''} ${className} dark:brightness-0 dark:invert`}
    />
  );
}