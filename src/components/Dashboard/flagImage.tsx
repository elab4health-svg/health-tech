type FlagImageProps = {
  code: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
};

export function FlagImage({ 
  code, 
  size = 'md', 
  className = '' 
}: FlagImageProps) {
  const sizeClasses = {
    sm: 'w-6 h-4',
    md: 'w-8 h-6',
    lg: 'w-12 h-8',
    xl: 'w-16 h-10',
    xxl: 'w-20 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img
        src={`/flags/${code}.png`}
        alt={`${code} flag`}
        className="object-contain w-full h-full" 
      />
    </div>
  );
}