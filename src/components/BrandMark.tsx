interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

export default function BrandMark({ size = 'md', className = '' }: BrandMarkProps) {
  return (
    <span className={`${sizes[size]} ${className} relative inline-flex shrink-0 overflow-hidden rounded-xl bg-white shadow-sm`}>
      <img
        src="/images/Gemini_Generated_Image_c9b65zc9b65zc9b6_(1).png"
        alt="UrjaSutra logo"
        className="absolute inset-0 h-full w-full object-contain object-center"
        />
    </span>
  );
}
