export default function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`glitch-wrap ${className}`} data-text={text}>
      {text}
      <span className="glitch-layer glitch-layer-cyan" aria-hidden="true">
        {text}
      </span>
      <span className="glitch-layer glitch-layer-pink" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
