// Emblema del MFC en un solo color (hereda currentColor): cruz y familia
// —padre, madre e hijo— dentro de un anillo. Sobre el encabezado verde se
// usa con text-white para obtener la versión blanca del logo.
export default function LogoMFC({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Emblema del Movimiento Familiar Cristiano"
      fill="none"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" />
      <rect x="46.25" y="13" width="7.5" height="47" rx="1.5" fill="currentColor" />
      <rect x="30" y="26" width="40" height="7.5" rx="1.5" fill="currentColor" />
      <circle cx="33.5" cy="57.5" r="5.5" fill="currentColor" />
      <circle cx="66.5" cy="57.5" r="5.5" fill="currentColor" />
      <circle cx="50" cy="63.5" r="4.5" fill="currentColor" />
      <path
        d="M20 86c1.6-11 7-16.5 13.5-16.5 4.8 0 8.3 3 10.4 8.2 1.7-4.1 3.7-6.2 6.1-6.2s4.4 2.1 6.1 6.2c2.1-5.2 5.6-8.2 10.4-8.2C73 69.5 78.4 75 80 86H20Z"
        fill="currentColor"
      />
    </svg>
  );
}
