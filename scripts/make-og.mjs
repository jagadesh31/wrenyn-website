import sharp from "sharp";
import fs from "node:fs";

const mark = "public/brand/kexoz-mark-512.png";
const w = 1200;
const h = 630;

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g" cx="72%" cy="18%" r="68%">
      <stop offset="0%" stop-color="#B6F36B" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#101310" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#101310"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="96" y="250" fill="#EDF2E9" font-family="Space Grotesk, Arial, sans-serif" font-size="92" font-weight="700" letter-spacing="-3">Kexoz</text>
  <text x="96" y="320" fill="#B6F36B" font-family="IBM Plex Mono, monospace" font-size="28" letter-spacing="2">BY WRENYN</text>
  <text x="96" y="390" fill="#EDF2E9" fill-opacity="0.72" font-family="Arial, sans-serif" font-size="30">Share local builds. Pin feedback. Same URL while you fix.</text>
  <text x="96" y="540" fill="#B6F36B" font-family="IBM Plex Mono, monospace" font-size="22">kexoz.dev</text>
</svg>`);

const markPng = await sharp(mark).resize(220, 220).png().toBuffer();
await sharp(svg)
  .composite([{ input: markPng, left: 860, top: 190 }])
  .jpeg({ quality: 90 })
  .toFile("public/brand/kexoz-og.jpg");

console.log("og written", fs.statSync("public/brand/kexoz-og.jpg").size);
