interface FreeBannerProps {
  className?: string;
}

export default function FreeBanner({ className = "" }: FreeBannerProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-accent text-white uppercase ${className}`}
    >
      FREE
    </span>
  );
}
