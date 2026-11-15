export default function KexozPreview() {
  return (
    <figure className="kx-preview kx-preview-shot">
      <video
        className="kx-preview-img"
        src="/brand/kexoz-review.mp4"
        poster="/brand/kexoz-review-poster.jpg"
        width={1100}
        height={680}
        controls
        playsInline
        preload="none"
        aria-label="Kexoz pinned feedback demo"
        aria-describedby="kexoz-demo-caption"
      >
        <a href="/brand/kexoz-review.mp4">Download the Kexoz review demo</a>
      </video>
      <figcaption className="kx-preview-caption" id="kexoz-demo-caption">
        In this silent demo, a reviewer pins a note to the Export button in a sample app. The share owner opens the pin and reads the request to label the button “Export CSV.”
      </figcaption>
    </figure>
  );
}
