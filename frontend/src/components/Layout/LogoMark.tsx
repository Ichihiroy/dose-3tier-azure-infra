interface LogoMarkProps {
  size?: number;
}

export default function LogoMark({ size = 36 }: LogoMarkProps) {
  const h = size;
  const w = size * 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 24"
      width={w}
      height={h}
      aria-hidden="true"
    >
      {/* Left half — forest green fill */}
      <path
        d="M12 0.75 L24 0.75 L24 23.25 L12 23.25 A11.25 11.25 0 0 1 12 0.75 Z"
        fill="#2D5A3D"
      />
      {/* Right half — cream fill */}
      <path
        d="M24 0.75 L36 0.75 A11.25 11.25 0 0 1 36 23.25 L24 23.25 Z"
        fill="#F7F4EF"
      />
      {/* Full capsule outline */}
      <path
        d="M12 0 L36 0 A12 12 0 0 1 36 24 L12 24 A12 12 0 0 1 12 0 Z"
        fill="none"
        stroke="#2D5A3D"
        strokeWidth="1.5"
      />
      {/* Center dividing line */}
      <line
        x1="24" y1="0.5"
        x2="24" y2="23.5"
        stroke="#2D5A3D"
        strokeWidth="1.5"
      />
    </svg>
  );
}
