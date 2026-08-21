#!/usr/bin/env node
/**
 * Video Poster Generator
 * Creates WebP poster images from video files for better performance
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

/**
 * For now, this script creates placeholder posters from existing images.
 * In production, use ffmpeg to extract first frame:
 * ffmpeg -i input.mp4 -ss 00:00:00 -vframes 1 -vf "scale=1280:720" output.webp
 */

const MEDIA_DIR = path.join(__dirname, "../public/media");

const POSTER_TARGETS = [
  {
    description: "Hero banner video poster",
    outputPath: "hero/banner-poster.webp",
    size: { width: 1280, height: 720 },
    quality: 85,
  },
];

/**
 * Creates a simple placeholder poster
 * In production, extract from actual video
 */
async function createPoster(target) {
  console.log(`📽️  Creating: ${target.outputPath}`);
  console.log(
    "   ℹ️  Placeholder poster created. In production, extract actual frame from video:"
  );
  console.log(
    `   ffmpeg -i hero/banner_v.mp4 -ss 00:00:00 -vframes 1 -vf "scale=${target.size.width}:${target.size.height}" ${target.outputPath}`
  );

  try {
    // Create a simple gradient placeholder
    const svgImage = `
      <svg width="${target.size.width}" height="${target.size.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0c;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16161b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="48" fill="#c9f24d" font-family="system-ui">
          Rabin R — Frontend Engineer
        </text>
      </svg>
    `;

    const outputPath = path.join(MEDIA_DIR, target.outputPath);
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const buffer = await sharp(Buffer.from(svgImage)).webp({ quality: target.quality }).toBuffer();

    fs.writeFileSync(outputPath, buffer);
    const stats = fs.statSync(outputPath);

    console.log(`   ✓ Created: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log();

    return { success: true, size: stats.size };
  } catch (err) {
    console.error(`   ✗ Failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log("🎬 VIDEO POSTER GENERATOR");
  console.log("=========================\n");

  for (const target of POSTER_TARGETS) {
    await createPoster(target);
  }

  console.log("✅ Poster generation complete!");
  console.log("\n📝 Production Implementation:");
  console.log("Install ffmpeg, then run:");
  console.log(
    'ffmpeg -i public/media/hero/banner_v.mp4 -ss 00:00:00 -vframes 1 -vf "scale=1280:720" public/media/hero/banner-poster.webp'
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
