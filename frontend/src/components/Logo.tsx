export default function Logo() {
  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Medical Symbol in Red */}
      <g>
        {/* Pulse Line */}
        <path
          d="M8 24H18M18 24L22 16M22 16L26 32M26 32L30 20M30 20H40"
          stroke="#EF4444"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Circle with Plus */}
        <circle cx="52" cy="24" r="10" fill="#FEE2E2" fillOpacity="0.8" stroke="#EF4444" strokeWidth="1.5" />
        <path d="M52 18V30M46 24H58" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Text in Blue */}
      <text
        x="68"
        y="28"
        fontFamily="'Inter', sans-serif"
        fontSize="20"
        fill="#1D4ED8"  // Tailwind blue-600
        fontWeight="600"
        letterSpacing="0.3px"
      >
        FindDoctor
      </text>
    </svg>
  );
}