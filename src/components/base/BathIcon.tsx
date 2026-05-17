interface BathIconProps {
  size?: number;
  className?: string;
}

export default function BathIcon({ size = 16, className = '' }: BathIconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
        alt="Bath"
        className="w-full h-full object-contain"
      />
    </span>
  );
}