// PESITM Compass Rose + Globe Logo
// Colors: deep navy #1a1f3a, orange #e85d26, amber/green #4adf9a
export default function PesitmLogo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PESITM Campus Autopilot logo"
    >
      <defs>
        <radialGradient id="globe" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1a1f3a" />
          <stop offset="100%" stopColor="#0f1326" />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#e85d26" strokeWidth="4" />
      {/* Globe */}
      <circle cx="50" cy="50" r="32" fill="url(#globe)" />
      {/* Latitude lines */}
      <ellipse cx="50" cy="50" rx="32" ry="10" fill="none" stroke="#4adf9a" strokeWidth="0.8" opacity="0.7" />
      <ellipse cx="50" cy="50" rx="32" ry="20" fill="none" stroke="#4adf9a" strokeWidth="0.8" opacity="0.5" />
      {/* Longitude */}
      <ellipse cx="50" cy="50" rx="10" ry="32" fill="none" stroke="#4adf9a" strokeWidth="0.8" opacity="0.7" />
      {/* Compass rose points */}
      <polygon points="50,4 54,46 50,42 46,46" fill="#e85d26" />
      <polygon points="96,50 54,54 58,50 54,46" fill="#e85d26" opacity="0.85" />
      <polygon points="50,96 46,54 50,58 54,54" fill="#e85d26" opacity="0.85" />
      <polygon points="4,50 46,46 42,50 46,54" fill="#e85d26" opacity="0.85" />
      {/* Center dot */}
      <circle cx="50" cy="50" r="4" fill="#e85d26" />
    </svg>
  )
}
