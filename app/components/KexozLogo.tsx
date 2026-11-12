type Props = {
  size?: number;
  className?: string;
  /** Show mark only, or mark + wordmark text. */
  withWord?: boolean;
};

/** Kexoz product mark — geometric K, not the Wrenyn bird. */
export default function KexozLogo({ size = 36, className = "", withWord = false }: Props) {
  return (
    <span className={`kx-logo ${withWord ? "has-word" : ""} ${className}`.trim()} style={{ ["--kx-size" as string]: `${size}px` }}>
      <img
        src="/brand/kexoz-mark.svg"
        alt=""
        width={size}
        height={size}
        className="kx-logo-mark"
        draggable={false}
      />
      {withWord && <span className="kx-logo-word">Kexoz</span>}
    </span>
  );
}
