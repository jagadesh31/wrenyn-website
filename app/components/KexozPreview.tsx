/** Product preview — Review UI composition for Wrenyn → Kexoz pages. */
export default function KexozPreview() {
  return (
    <figure className="kx-preview kx-preview-shot">
      <img
        className="kx-preview-img"
        src="/brand/kexoz-product-preview.jpg"
        alt="Kexoz review UI with pinned feedback on a live preview"
        width={1600}
        height={900}
        decoding="async"
        draggable={false}
      />
    </figure>
  );
}
